import TranslationArea from "@/components/translation-area/translation-area";
import { ProviderWrapper } from "@/components/wrappers/provider-wrapper";

export default async function Home() {
  return (
    <main className="container py-4 md:py-28 flex flex-col gap-2">
      <h1 className="text-3xl md:text-4xl font-bold mt-2 md:mt-0 md:p-5 text-center">
        TranslateGPT
      </h1>

      <p className="p-5 text-sm md:text-xl text-center">
        This app uses the OpenAI GPT-3.5 model to translate text between
        languages. You will need to bring your own API key to use this service.
        This is mostly just a fun experiment and not a serious translation tool
        (however, it can be surprisingly good at times).
      </p>

      <ProviderWrapper>
        <TranslationArea />
      </ProviderWrapper>
    </main>
  );
}
