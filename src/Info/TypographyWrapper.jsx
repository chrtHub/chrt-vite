export default function TypographyWrapper({ children }) {
  return (
    <div className="flex justify-center">
      <article
        className="lg:prose-md prose prose-zinc mt-8
  hover:prose-a:text-green-600 dark:prose-invert dark:hover:prose-a:text-green-600"
      >
        {children}
      </article>
    </div>
  );
}
