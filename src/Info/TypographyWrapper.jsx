export default function TypographyWrapper({ children }) {
  return (
    <article
      className="lg:prose-md prose prose-zinc
  hover:prose-a:text-green-600 dark:prose-invert dark:hover:prose-a:text-green-600"
    >
      {children}
    </article>
  );
}
