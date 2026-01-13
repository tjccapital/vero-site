"use client";

import { TracingBeam } from "@/components/ui/tracing-beam";

export function BlogContent({ content }: { content: string }) {
  return (
    <TracingBeam className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div
          className="prose prose-lg prose-gray max-w-none
            prose-headings:font-semibold prose-headings:text-gray-900
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-6
            prose-a:text-primary-900 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-gray-900 prose-strong:font-semibold
            prose-ol:text-gray-600 prose-ol:my-6 prose-ol:pl-6
            prose-ul:text-gray-600 prose-ul:my-6 prose-ul:pl-6
            prose-li:mb-2"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </TracingBeam>
  );
}
