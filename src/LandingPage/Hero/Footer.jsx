export default function Footer() {
  return (
    <>
      {/* START OF FOOTER */}
      <footer>
        <div className="mx-auto max-w-7xl py-12 px-6 md:flex md:justify-between lg:px-8">
          <div className="flex justify-center md:order-2">
            <a href="mailto:support@chrt.com" className="text-zinc-500">
              support@chrt.com
            </a>
          </div>

          <div className="mt-8 md:order-1 md:mt-0">
            <p className="text-center text-xs leading-5 text-zinc-500">
              &copy; 2023 CHRT.com, all rights reserved.
            </p>
          </div>
        </div>
      </footer>
      {/* END OF FOOTER */}
    </>
  );
}
