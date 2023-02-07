export default function TermsDoc() {
  return (
    <>
      <h1 id="google-oauth2-homepage">OAuth 2 - Google Accounts</h1>

      <h3 id="what-is-chrt-">What is CHRT?</h3>
      <ul>
        <li>
          CHRT is a site that provides software for day traders. Our current
          services include:
          <ul>
            <li>
              Journal Service - upload your brokerage files and see analysis of
              your trading performance
            </li>
            <li>
              Data Service - access pricing data, news, SEC filings, company
              summaries, and more for thousands of symbols
            </li>
          </ul>
        </li>
        <li>
          Future services may include similar offerings such as a strategy
          backtesting service, market scanner, realtime market data analysis
          service, etc.
        </li>
      </ul>

      <h3 id="what-is-a-google-oauth2-connection-">
        What is a Google OAuth2 connection?
      </h3>
      <ul>
        <li>
          When you create your CHRT account, you can choose to protect the
          account using:
          <ul>
            <li>an email address and a password</li>
            <li>your existing Google account</li>
          </ul>
        </li>
        <li>
          When you choose to use an existing Google account, you&#39;ll sign in
          to your CHRT account using a process known as{" "}
          <a href="https://oauth.net/2/">OAuth 2</a>
        </li>
        <li>
          OAuth 2 involves redirecting you from our login page to Google&#39;s
          authentication servers. Upon successful authentication with Google,
          you are redirected back to CHRT&#39;s site with permission to access
          your CHRT account.
        </li>
        <li>
          When CHRT redirects you to Google, our service includes requests for
          certain data (defined by parameters known as &quot;scopes&quot;, such
          as your name, email address, etc) which are returned to us if you
          authenticate successfully
        </li>
        <li>
          This page describes what scopes we request, why we request them, and
          what we do with the data from your Google account
        </li>
      </ul>

      <h3 id="what-data-scopes-does-chrt-request-">
        What data (scopes) does CHRT request?
      </h3>
      <ul>
        <li>
          Non-sensitive scopes:
          <ul>
            <li>
              <code>./auth/userinfo.email</code> - See your primary Google
              Account email address
            </li>
            <li>
              <code>./auth/userinfo.profile</code> - See your personal info,
              including any personal info you&#39;ve made publicly available
            </li>
            <li>
              <code>openid</code> - Associate your with your personal info on
              Google
            </li>
          </ul>
        </li>
        <li>
          Sensitive scopes:
          <ul>
            <li>
              <em>none</em>
            </li>
          </ul>
        </li>
        <li>
          Restricted scopes:
          <ul>
            <li>
              <em>none</em>
            </li>
          </ul>
        </li>
      </ul>

      <h3 id="how-does-data-enhance-user-functionality-">
        How does the Google OAuth 2 connection user data enhance user
        functionality?
      </h3>
      <ul>
        <li>
          The biggest enhancement is simply the ease of creating an account and
          signing in using your existing Google credentials
        </li>
        <li>
          Your name and email address are used in our application to communicate
          with you and are displayed, at your discretion, on your account
          profile
        </li>
        <li>
          In the future, if we request additional scopes (such as calendar data,
          etc.), we&#39;ll need to update this page and get your individual
          consent before Google grants CHRT access to those scopes and data
        </li>
      </ul>

      <h3 id="why-use-a-google-oauth-2-connection">
        Why use a Google OAuth 2 connection for a CHRT account?
      </h3>
      <ul>
        <li>
          It&#39;s very convenient.
          <ul>
            <li>
              You can create a CHRT account without creating and remembering a
              new username and password.
            </li>
            <li>
              You can authenticate (sign in) using your Google credentials,
              which might already be stored in your browser, especially if you
              use Google Chrome.
            </li>
          </ul>
        </li>
      </ul>

      <h3 id="other">Other</h3>
      <ul>
        <li>
          CHRT&#39;s{" "}
          <a href={`${window.location.origin}/privacy`}>Privacy Policy</a>
        </li>
        <li>
          Other info, such as our Terms of Service and Cookies policy, can be
          found at <a href={`${window.location.origin}/info`}>chrt.com/info</a>
        </li>
      </ul>
    </>
  );
}
