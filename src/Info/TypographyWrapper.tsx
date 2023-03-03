interface IProps {
  children?: React.ReactNode;
}
export default function TypographyWrapper({ children }: IProps) {
  return (
    <div id="wrapper-div" className="flex justify-center">
      <div className="flex-column">
        <article
          className="lg:prose-md prose prose-zinc mt-8
  hover:prose-a:text-green-600 dark:prose-invert dark:hover:prose-a:text-green-600"
        >
          {children}
        </article>
        <div id="bottom-spacer" className="-mt-32 h-screen" />
      </div>
    </div>
  );
}
