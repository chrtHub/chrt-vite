//-- Scroll Container Logic --//
const [showScrollToBottomButton, setShowScrollToBottomButton] =
  useState<boolean>(false);
const outerDiv = useRef<HTMLDivElement>(null);
const innerDiv = useRef<HTMLDivElement>(null);
const prevInnerDivHeight = useRef<number | null>(null);

//-- Scroll to bottom (a) on initial render, (b) if user was at bottom --//
useEffect(() => {
  const outerDivHeight = outerDiv.current?.clientHeight || 0;
  const innerDivHeight = innerDiv.current?.clientHeight || 0;
  const outerDivScrollTop = outerDiv.current?.scrollTop || 0;
  console.log(
    "outerDivHeight: " + outerDivHeight,
    "innerDivHeight: " + innerDivHeight,
    "outerDivScrollTop: " + outerDivScrollTop
  ); // DEV

  const isInitialRender: boolean = !prevInnerDivHeight.current;
  const userWasAtBottom: boolean =
    outerDivScrollTop === (prevInnerDivHeight.current ?? 0) - outerDivHeight;

  console.log("SCROLL CONTAINER EFFECT");
  console.log(
    "isInitialRender: ",
    isInitialRender,
    "userWasAtBottom: ",
    userWasAtBottom
  ); // DEV

  if (isInitialRender || userWasAtBottom) {
    outerDiv.current?.scrollTo({
      top: innerDivHeight - outerDivHeight,
      left: 0,
    });
  } else {
    setShowScrollToBottomButton(true);
  }

  //-- Save inner div dimensnion to use during comparison on next update --//
  prevInnerDivHeight.current = innerDivHeight;
}, [ChatContext]);

const handleScrollToBottom = useCallback(() => {
  const outerDivHeight = outerDiv.current?.clientHeight || 0;
  const innerDivHeight = innerDiv.current?.clientHeight || 0;

  console.log("SCROLL TO BOTTOM HANDLER");
  console.log(
    "outerDivHeight:",
    outerDivHeight,
    "innerDivHeight",
    innerDivHeight
  ); // DEV

  outerDiv.current?.scrollTo({
    top: innerDivHeight - outerDivHeight,
    left: 0,
    behavior: "smooth",
  });

  setShowScrollToBottomButton(false);
}, []);

//   <div
//   id="scroll-container-outer"
//   ref={outerDiv}
//   className="relative overflow-scroll"
// >
//   <div
//     id="scroll-container-inner"
//     ref={innerDiv}
//     className="relative"
//   >
