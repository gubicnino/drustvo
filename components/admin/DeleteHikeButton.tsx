"use client";

import { deleteHikeAction } from "@/app/admin/(dashboard)/actions";

export function DeleteHikeButton({ id, title }: { id: string; title: string }) {
  return (
    <form
      action={deleteHikeAction}
      onSubmit={(e) => {
        if (!confirm(`Res želiš izbrisati pohod "${title}"? Tega ni mogoče razveljaviti.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="rounded-lg px-2.5 py-1.5 text-sm font-medium text-red-600 transition-colors duration-200 hover:bg-red-50 cursor-pointer"
      >
        Izbriši
      </button>
    </form>
  );
}
