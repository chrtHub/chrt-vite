export default function BackgroundGradientBottom() {
  return (
    <div className="absolute inset-x-0 top-[calc(100%-13rem)] transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
      <svg
        className="relative left-[calc(50%+3rem)] h-[21.1875rem] max-w-none -translate-x-1/2 sm:left-[calc(50%+36rem)] sm:h-[42.375rem]"
        viewBox="0 0 1155 678"
      >
        <path
          fill="url(#b9e4a85f-ccd5-4151-8e84-ab55c66e5aa1)"
          fillOpacity=".3"
          d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
        />
        <defs>
          <linearGradient
            id="b9e4a85f-ccd5-4151-8e84-ab55c66e5aa1"
            x1="1155.49"
            x2="-78.208"
            y1=".177"
            y2="474.645"
            gradientUnits="userSpaceOnUse"
          >
            <stop
              //-- lime 500 --//
              stopColor="#84cc16"
            />
            <stop
              offset={1}
              //-- green 500 --//
              stopColor="#22c55e"
            />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
