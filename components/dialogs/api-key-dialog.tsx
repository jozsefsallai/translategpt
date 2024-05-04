import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const apiKeyFormSchema = z.object({
  apiKey: z
    .string()
    .regex(/sk-[a-zA-Z0-9+\/]{48}/g, "The API key you've provided is invalid."),
});

export interface ApiKeyDialogProps {
  open?: boolean;
  onOpenStateChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  currentApiKey?: string | null;
  onApiKeyChange?: (apiKey: string) => void;
  onClearApiKey?: () => void;
}

export function ApiKeyDialog(props: ApiKeyDialogProps) {
  const form = useForm<z.infer<typeof apiKeyFormSchema>>({
    resolver: zodResolver(apiKeyFormSchema),
    defaultValues: {
      apiKey: props.currentApiKey ?? "",
    },
  });

  function onSubmit(values: z.infer<typeof apiKeyFormSchema>) {
    props.onApiKeyChange?.(values.apiKey);
  }

  function onClearApiKey(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    props.onClearApiKey?.();
  }

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenStateChange}>
      {props.trigger && <DialogTrigger asChild>{props.trigger}</DialogTrigger>}

      <DialogContent className="sm:max-w-[430px]">
        <DialogHeader>
          <DialogTitle>Specify OpenAI API key</DialogTitle>
          <DialogDescription>
            Please provide your OpenAI API key to use the translation service.
            The key will always be stored in your browser and never stored on
            the server.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OpenAI API key:</FormLabel>
                  <FormControl>
                    <Input placeholder="sk-..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              {props.currentApiKey && (
                <Button variant="destructive" onClick={onClearApiKey}>
                  Clear API key
                </Button>
              )}

              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
