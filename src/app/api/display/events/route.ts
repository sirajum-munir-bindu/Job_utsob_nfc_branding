import { NextRequest } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET /api/display/events — Server-Sent Events stream for live TV display
export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let isClosed = false;
      let lastUpdatedAt = "";

      const sendState = async () => {
        if (isClosed) return;
        try {
          const state = await db.displayState.get();
          const currentUpdated = state.updatedAt ? state.updatedAt.toISOString() : "";

          // Only send event if state changed or first connection
          if (currentUpdated !== lastUpdatedAt) {
            lastUpdatedAt = currentUpdated;
            const payload = JSON.stringify({
              mode: state.mode || "WELCOME",
              studentName: state.studentName || null,
              cardImageUrl: state.cardImageUrl || null,
              isPaused: state.isPaused || false,
              updatedAt: currentUpdated,
            });

            controller.enqueue(encoder.encode(`event: display_update\ndata: ${payload}\n\n`));
          } else {
            // Heartbeat
            controller.enqueue(encoder.encode(`: heartbeat\n\n`));
          }
        } catch (e) {
          // ignore stream write errors
        }
      };

      // Send initial state immediately
      await sendState();

      // Poll every 1.5 seconds for live push
      const interval = setInterval(async () => {
        if (isClosed) {
          clearInterval(interval);
          return;
        }
        await sendState();
      }, 1500);

      req.signal.addEventListener("abort", () => {
        isClosed = true;
        clearInterval(interval);
        try {
          controller.close();
        } catch {}
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
