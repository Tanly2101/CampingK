import React from "react";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <div>
      {" "}
      <footer>
        <div className="waves">
          <div className="wave" id="wave1"></div>
          <div className="wave" id="wave2"></div>
          <div className="wave" id="wave3"></div>
          <div className="wave" id="wave4"></div>
        </div>
        <div className="w-[1600px] m-auto sm:w-full">
          <div className="Final grid grid-cols-2 gap-4">
            <div>Go further. Sleep wild.</div>

            <div className="grid grid-cols-3 gap-4">
              <div className="grid grid-row-4 gap-1 h-10 flex justify-center">
                <p style={{ fontSize: "16px" }}>SITE</p>
                <Link>Shop all</Link>
                <Link>Out story</Link>
                <Link>Blog</Link>
              </div>
              <div>
                <ul className="menu">
                  <div className="">ALL</div>
                  <li>
                    <a href="#">Home</a>
                  </li>
                  <li>
                    <a href="#">About</a>
                  </li>
                  <li>
                    <a href="#">Team</a>
                  </li>
                  <li>
                    <a href="#">Contact</a>
                  </li>
                </ul>
              </div>
              <div>
                <div className="flex justify-center">Follow</div>
                <ul className="icon-social ">
                  <li>
                    <a href="#">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1em"
                        height="1em"
                        viewBox="0 0 1000 1000"
                      >
                        <path
                          fill="currentColor"
                          d="M182.594 0C81.445 0 0 81.445 0 182.594v634.813c0 101.149 81.445 182.594 182.594 182.594h344.063V609.063H423.282v-140.75h103.375v-120.25c0-94.475 61.079-181.219 201.781-181.219c56.968 0 99.094 5.469 99.094 5.469l-3.313 131.438s-42.963-.406-89.844-.406c-50.739 0-58.875 23.378-58.875 62.188v102.781h152.75l-6.656 140.75H675.5v390.938h141.906c101.149 0 182.594-81.445 182.594-182.594V182.595C1000 81.446 918.555.001 817.406.001H182.593z"
                        ></path>
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1em"
                        height="1em"
                        viewBox="0 0 15 15"
                      >
                        <path
                          fill="currentColor"
                          d="M14.977 1.467a.5.5 0 0 0-.87-.301a2.559 2.559 0 0 1-1.226.763A3.441 3.441 0 0 0 10.526 1a3.539 3.539 0 0 0-3.537 3.541v.44C3.998 4.75 2.4 2.477 1.967 1.325a.5.5 0 0 0-.916-.048C.004 3.373-.157 5.407.604 7.139C1.27 8.656 2.61 9.864 4.51 10.665C3.647 11.276 2.194 12 .5 12a.5.5 0 0 0-.278.916C1.847 14 3.55 14 5.132 14h.048c4.861 0 8.8-3.946 8.8-8.812v-.479c.363-.37.646-.747.82-1.236c.193-.546.232-1.178.177-2.006"
                        ></path>
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1.13em"
                        height="1em"
                        viewBox="0 0 576 512"
                      >
                        <path
                          fill="currentColor"
                          d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597c-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821c11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305m-317.51 213.508V175.185l142.739 81.205z"
                        ></path>
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1em"
                        height="1em"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M12 9.52A2.48 2.48 0 1 0 14.48 12A2.48 2.48 0 0 0 12 9.52m9.93-2.45a6.53 6.53 0 0 0-.42-2.26a4 4 0 0 0-2.32-2.32a6.53 6.53 0 0 0-2.26-.42C15.64 2 15.26 2 12 2s-3.64 0-4.93.07a6.53 6.53 0 0 0-2.26.42a4 4 0 0 0-2.32 2.32a6.53 6.53 0 0 0-.42 2.26C2 8.36 2 8.74 2 12s0 3.64.07 4.93a6.86 6.86 0 0 0 .42 2.27a3.94 3.94 0 0 0 .91 1.4a3.89 3.89 0 0 0 1.41.91a6.53 6.53 0 0 0 2.26.42C8.36 22 8.74 22 12 22s3.64 0 4.93-.07a6.53 6.53 0 0 0 2.26-.42a3.89 3.89 0 0 0 1.41-.91a3.94 3.94 0 0 0 .91-1.4a6.6 6.6 0 0 0 .42-2.27C22 15.64 22 15.26 22 12s0-3.64-.07-4.93m-2.54 8a5.73 5.73 0 0 1-.39 1.8A3.86 3.86 0 0 1 16.87 19a5.73 5.73 0 0 1-1.81.35H8.94A5.73 5.73 0 0 1 7.13 19a3.51 3.51 0 0 1-1.31-.86A3.51 3.51 0 0 1 5 16.87a5.49 5.49 0 0 1-.34-1.81V8.94A5.49 5.49 0 0 1 5 7.13a3.51 3.51 0 0 1 .86-1.31A3.59 3.59 0 0 1 7.13 5a5.73 5.73 0 0 1 1.81-.35h6.12a5.73 5.73 0 0 1 1.81.35a3.51 3.51 0 0 1 1.31.86A3.51 3.51 0 0 1 19 7.13a5.73 5.73 0 0 1 .35 1.81V12c0 2.06.07 2.27.04 3.06Zm-1.6-7.44a2.38 2.38 0 0 0-1.41-1.41A4 4 0 0 0 15 6H9a4 4 0 0 0-1.38.26a2.38 2.38 0 0 0-1.41 1.36A4.27 4.27 0 0 0 6 9v6a4.27 4.27 0 0 0 .26 1.38a2.38 2.38 0 0 0 1.41 1.41a4.27 4.27 0 0 0 1.33.26h6a4 4 0 0 0 1.38-.26a2.38 2.38 0 0 0 1.41-1.41a4 4 0 0 0 .26-1.38V9a3.78 3.78 0 0 0-.26-1.38ZM12 15.82A3.81 3.81 0 0 1 8.19 12A3.82 3.82 0 1 1 12 15.82m4-6.89a.9.9 0 0 1 0-1.79a.9.9 0 0 1 0 1.79"
                        ></path>
                      </svg>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="m-[50px] border-t-4 border-white">
            <div></div>
            <div className="flex flex-row justify-between ">
              <div className="logo ">
                <img
                  src={require("../assets/img/Logo.png")}
                  className="h-[100px]"
                ></img>
              </div>
              <div className="flex flex-row items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="48px"
                  viewBox="0 -960 960 960"
                  width="48px"
                  fill="#FFFFFF"
                >
                  <path d="m282-40 121-620q5-24 23-37t38-13q20 0 37.5 9t28.5 26l39 64q19 32 52.5 57t78.5 39v-75h40v550h-40v-414q-51-11-96-39t-80-69l-29 145 85 81v296h-60v-244l-100-95-74 339h-64Zm17-403-75-14q-10-2-17.5-13t-5.5-22l30-157q5-29 29-44.5t53-10.5l36 7-50 254Zm231-311q-30 0-51.5-21.5T457-827q0-30 21.5-51.5T530-900q30 0 51.5 21.5T603-827q0 30-21.5 51.5T530-754Z" />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="48px"
                  viewBox="0 -960 960 960"
                  width="48px"
                  fill="#FFFFFF"
                >
                  <path d="M80-80v-183l363-491-67-90 49-35 55 75 56-75 48 35-66 90 362 491v183H80Zm400-623L140-243v103h145l195-273 195 273h145v-103L480-703ZM359-140h242L480-310 359-140Zm121-273 195 273-195-273-195 273 195-273Z" />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="48px"
                  viewBox="0 -960 960 960"
                  width="48px"
                  fill="#FFFFFF"
                >
                  <path d="M163-484q-17 0-30-13t-13-30q0-17 13-30t30-13q17 0 30 13t13 30q0 17-13 30t-30 13ZM120.32-80v-186H80v-165q0-12 9.55-19.5t23.67-7.5h99.66q14.12 0 23.62 7.5Q246-443 246-431v165h-39v126h368v-243h-81q-65 0-111-43.97T337-534q0-46 27.5-88t77.5-59q7-70 55-114.5T608.5-840q63.5 0 111 44.5T775-681q50 17 77.5 59t27.5 88q0 63.06-46.5 107.03T722-383h-87v243h211v60H120.32ZM494-443h228q38 0 68-26t30-65q0-31.18-20-56.59Q780-616 751-628l-36-15v-31q0-45-32-75.5T608.26-780q-42.73 0-74.5 30.5Q502-719 502-674v31l-36 15q-29 12-49 37.41-20 25.41-20 56.59 0 39 29.5 65t67.5 26Zm115-169Z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex flex-gap flex-x-4 mx-[50px] text-[17px]">
            <span>2024@ Thuong Hieu</span>
            <span style={{ padding: "0 10px  0 10px" }}>
              Gia tri di doi voi chat luong
            </span>
            <span>Hang chat luong cao</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
