
import { useNavigate } from "react-router-dom";

export default function Onboarding() {
  const navigate = useNavigate();

  return (
    <main className="h-dvh w-full overflow-hidden bg-[#e9e9e9] sm:flex sm:items-center sm:justify-center sm:p-3">

      <div className="mx-auto flex h-full w-full max-w-[430px] flex-col overflow-hidden bg-white sm:shadow-xl">

        {/* Blue illustration section */}
        <section className="relative min-h-0 flex-[0_0_66%] overflow-hidden bg-[#4563ed]">

          {/* Top right circle */}
          <div className="absolute -right-5 -top-5 h-16 w-16 rounded-full border-[10px] border-white/10" />

          {/* Top left pattern */}
          <svg
            viewBox="0 0 110 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-0 top-[12%] h-[90px] w-[90px] sm:h-[110px] sm:w-[110px]"
          >
            <path
              d="M97.3595 27.6834L120.545 5.62852L116.41 1.28118L97.5715 19.2008L79.3073 1.20699e-05L57.5706 20.6765L41.3741 3.64938L19.6374 24.3258L3.09619 6.93646L-19.0028 27.9575L-14.8675 32.3049L2.88414 15.4191L19.4253 32.8085L41.162 12.132L57.3586 29.1591L79.0953 8.48264L97.3595 27.6834ZM97.6422 44.6663L120.828 22.6115L116.693 18.2641L97.8543 36.1837L79.5901 16.9829L57.8534 37.6594L41.6568 20.6323L19.9201 41.3088L3.37897 23.9194L-18.72 44.9405L-14.5847 49.2878L3.16692 32.402L19.7081 49.7914L41.4448 29.1149L57.6413 46.142L79.378 25.4656L97.6422 44.6663ZM121.111 39.5944L97.925 61.6493L79.6608 42.4485L57.9241 63.125L41.7276 46.0979L19.9909 66.7743L3.44971 49.385L-14.3019 66.2707L-18.4372 61.9234L3.66176 40.9023L20.2029 58.2917L41.9396 37.6152L58.1362 54.6423L79.8729 33.9659L98.1371 53.1666L116.976 35.247L121.111 39.5944ZM98.2078 78.6322L121.394 56.5773L117.258 52.23L98.4199 70.1496L80.1557 50.9488L58.419 71.6253L42.2224 54.5982L20.4857 75.2746L3.94454 57.8853L-18.1544 78.9063L-14.0192 83.2537L3.73249 66.3679L20.2737 83.7573L42.0104 63.0808L58.2069 80.1079L79.9436 59.4314L98.2078 78.6322Z"
              fill="#6684ff"
              fillRule="evenodd"
              clipRule="evenodd"
              opacity="0.75"
            />
          </svg>

          {/* Bottom right pattern */}
          <svg
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute bottom-[6%] right-0 h-[85px] w-[85px] sm:h-[110px] sm:w-[110px]"
          >
            <path
              d="M116.362 27.6834L139.548 5.62849L135.413 1.28115L116.574 19.2007L98.3101 -1.84476e-05L76.5734 20.6764L60.3769 3.64935L38.6402 24.3258L22.099 6.93643L1.40965e-05 27.9575L4.1353 32.3048L21.8869 15.4191L38.4281 32.8084L60.1648 12.132L76.3614 29.1591L98.0981 8.48261L116.362 27.6834ZM116.645 44.6663L139.831 22.6114L135.696 18.2641L116.857 36.1837L98.5929 16.9829L76.8562 37.6594L60.6596 20.6323L38.9229 41.3087L22.3818 23.9194L0.282798 44.9404L4.41809 49.2878L22.1697 32.402L38.7109 49.7914L60.4476 29.1149L76.6441 46.142L98.3809 25.4655L116.645 44.6663ZM140.114 39.5944L116.928 61.6492L98.6636 42.4485L76.9269 63.1249L60.7304 46.0978L38.9937 66.7743L22.4525 49.3849L4.70087 66.2707L0.565581 61.9234L22.6646 40.9023L39.2057 58.2917L60.9424 37.6152L77.139 54.6423L98.8757 33.9658L117.14 53.1666L135.978 35.247L140.114 39.5944ZM117.211 78.6322L140.396 56.5773L136.261 52.2299L117.423 70.1495L99.1585 50.9488L77.4218 71.6252L61.2252 54.5981L39.4885 75.2746L22.9473 57.8852L0.848365 78.9063L4.98366 83.2536L22.7353 66.3679L39.2765 83.7572L61.0132 63.0808L77.2097 80.1079L98.9464 59.4314L117.211 78.6322Z"
              fill="#6684ff"
              fillRule="evenodd"
              clipRule="evenodd"
              opacity="0.75"
            />
          </svg>

        </section>

        {/* White content section */}
        <section className="flex min-h-0 flex-[0_0_34%] flex-col justify-between bg-white px-5 pb-5 pt-4 sm:px-6 sm:pb-6 sm:pt-5">

          <div>
            <h1 className="text-lg font-bold leading-tight tracking-tight text-[#171923] sm:text-2xl">
              Manage What To Do
            </h1>

            <p className="mt-3 max-w-[290px] text-[10px] leading-relaxed text-gray-500 sm:text-xs">
              The best way to manage what you have to do,
              don't forget your plans.
            </p>
          </div>

          <button
            onClick={() => navigate("/")}
            className="h-10 w-full shrink-0 bg-[#4563ed] text-xs font-semibold text-white transition hover:bg-[#344fd1] active:scale-[0.99] sm:h-12 sm:text-sm"
          >
            Get Started
          </button>

        </section>
      </div>
    </main>
  );
}
