export default function SystemRequirementsDoc() {
  return (
    <>
      <h1 id="system-requirements">System Requirements</h1>
      <p>Effective date: June 12, 2023</p>

      <h1 id="minimum-system-requirements">Minimum System Requirements</h1>
      <h3 id="browser-software">Browser Software</h3>
      <ul>
        <li>
          <strong>Modern web browser.</strong> The newest stable release of a
          Chromium-based browser, ideally Google Chrome, but including Mozilla
          Firefox and Brave Browser
          <ul>
            <li>
              <strong>Other modern browsers</strong> may be used, but will not
              receive debugging support from CHRT. We develop software for
              Chromium-based browsers, so those generally have the best
              performance.
            </li>
            <li>
              <strong>Mobile browsers</strong> are not the intended target for
              our browser software products, but may be used, although they will
              not receive debugging Support from CHRT.
            </li>
          </ul>
        </li>
        <li>
          <strong>Computer system.</strong> A computer system which meets the
          system requirements of stated modern web browser
        </li>
        <li>
          <strong>Internet connection.</strong> At least 5 Mbps (megabits per
          second) internet connection. A slower connection may lead to poor user
          experience. A faster connection may lead to better performance. We
          recommend an internet connection exceeding 100 Mbps.
        </li>
        <li>
          <strong>Display.</strong> Modern computer display with a resolution of
          at least 1920 x 1080 pixels
        </li>
        <li>
          <strong>Inputs.</strong> Standard modern keyboard and mouse inputs
        </li>
      </ul>

      {/* <h3 id="mobile-application-software-expected-q2-2023-">
        Mobile Application Software
      </h3>
      <ul>
        <li>
          <strong>Android.</strong> Systems meeting the minimum system
          requirements for the latest major release of the Android platform.
        </li>
        <li>
          <strong>iPhone.</strong> Systems meeting the minimum system
          requirements for the latest major release of the iOS platform.
        </li>
      </ul> */}

      {/* <h3 id="desktop-software">Desktop Software</h3>
      <ul>
        <li>
          Currently we deliver our software via web browsers and mobile
          applications, but we could develop a downloadable version for modern
          systems such as MacOS, Windows, and Linux. Web browsers offer many
          benefits to users and developers, but if you have a strong preference
          for downloadable desktop software, please contact us at (support [at]
          chrt [dot] com) with the subject like &quot;please develop
          downloadable desktop software&quot;.
        </li>
      </ul> */}

      <h3 id="failure-to-meet-system-requirements">
        Failure to meet system requirements
      </h3>
      <ul>
        <li>
          In general, using a system that does not meet these requirements will
          result in a poor user experience. In some cases, the software will be
          inaccesible or inoperable.
        </li>
        <li>
          If you can use a device to access this page and our homepage at{" "}
          <a href="https://chrt.com">chrt.com</a>, it&#39;s very likely, but not
          guaranteed, that the device meets our minimum system requirements.
        </li>
        <li>
          Exceptions may include (1) certain low-performance mobile devices and
          (2) tablets or devices not intended for accessing web applications.
        </li>
      </ul>
    </>
  );
}
