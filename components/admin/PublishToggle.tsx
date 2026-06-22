import { togglePublishAction } from "@/app/admin/(dashboard)/actions";
import { cn } from "@/lib/utils";

/** Server-action toggle styled as a switch. Submits and the page revalidates. */
export function PublishToggle({ id, published }: { id: string; published: boolean }) {
  return (
    <form action={togglePublishAction}>
      <input type="hidden" name="id" value={id} />
      {/* Submit the OPPOSITE of the current state */}
      <input type="hidden" name="published" value={(!published).toString()} />
      <button
        type="submit"
        role="switch"
        aria-checked={published}
        aria-label={published ? "Skrij pohod" : "Objavi pohod"}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine",
          published ? "bg-pine" : "bg-border",
        )}
      >
        <span
          className={cn(
            "inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200",
            published ? "translate-x-5" : "translate-x-0.5",
          )}
        />
      </button>
    </form>
  );
}
