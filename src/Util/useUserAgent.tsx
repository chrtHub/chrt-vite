import UAParser from "ua-parser-js";

const useIsMobile = (): boolean => {
  //-- For mobile clients, use 'localStorage' cache because sometimes the auth redirect hangs if using 'memory' --//
  const parser = new UAParser();
  const userAgent = parser.getResult();
  const type = userAgent.device.type;
  const mobileTypes = [
    "console", //-- e.g. Xbox --//
    "mobile", //-- e.g. iPhone --//
    "tablet", //-- e.g. iPad --//
    "smarttv", //-- e.g. Apple TV --//
    "wearable", //-- e.g. Apple Watch --//
    "embedded", //-- e.g. iot device --//
  ];
  const isMobile = type ? mobileTypes.includes(type) : false;
  return isMobile;
};

const useOSName = () => {
  const parser = new UAParser();
  /**
   * Possible 'os.name'
   * AIX, Amiga OS, Android, Arch, Bada, BeOS, BlackBerry, CentOS, Chromium OS, Contiki,
   * Fedora, Firefox OS, FreeBSD, Debian, DragonFly, Gentoo, GNU, Haiku, Hurd, iOS,
   * Joli, Linpus, Linux, Mac OS, Mageia, Mandriva, MeeGo, Minix, Mint, Morph OS, NetBSD,
   * Nintendo, OpenBSD, OpenVMS, OS/2, Palm, PCLinuxOS, Plan9, Playstation, QNX, RedHat,
   * RIM Tablet OS, RISC OS, Sailfish, Series40, Slackware, Solaris, SUSE, Symbian, Tizen,
   * Ubuntu, UNIX, VectorLinux, WebOS, Windows [Phone/Mobile], Zenwalk
   */
  const { name } = parser.getOS();

  return name || "";
};

export { useIsMobile, useOSName };
