import type { PostBlock } from "@/lib/validations/post";

export function PostBody({ blocks }: { blocks: PostBlock[] }) {
  return (
    <div className="space-y-6 text-lg leading-relaxed">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "h2":
            return (
              <h2 key={i} className="pt-4 text-2xl font-bold tracking-tight sm:text-3xl">
                {block.text}
              </h2>
            );
          case "quote":
            return (
              <blockquote key={i} className="border-l-4 border-primary pl-6 text-xl font-medium italic">
                {block.text}
                {block.cite && (
                  <footer className="mt-2 text-sm font-normal text-muted-foreground not-italic">
                    {block.cite}
                  </footer>
                )}
              </blockquote>
            );
          case "list":
            return (
              <ul key={i} className="list-outside list-disc space-y-2 pl-6 marker:text-primary">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          default:
            return (
              <p key={i} className="text-muted-foreground">
                {block.text}
              </p>
            );
        }
      })}
    </div>
  );
}