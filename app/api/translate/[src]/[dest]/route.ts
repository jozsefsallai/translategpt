import { TranslationError, handleTranslate } from "@/core/handle-translate";

interface GETTranslationRequestParams {
  src: string;
  dest: string;
}

export async function GET(
  req: Request,
  { params }: { params: GETTranslationRequestParams }
): Promise<Response> {
  const { src, dest } = params;
  const { searchParams } = new URL(req.url);

  const text = searchParams.get("text");
  const apiKey = req.headers.get("x-api-key");

  try {
    const response = await handleTranslate({
      apiKey,
      src,
      dest,
      text,
    });

    return Response.json(response);
  } catch (err: any) {
    if (err.name === "TranslationError") {
      const { message, code } = err as TranslationError;
      return Response.json(
        {
          error: message,
        },
        { status: code }
      );
    }

    return Response.json(
      {
        error: "Internal server error.",
      },
      { status: 500 }
    );
  }
}
