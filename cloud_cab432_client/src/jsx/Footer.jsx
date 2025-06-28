import Grid from "@mui/material/Unstable_Grid2";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import React from "react";
import { CreditModal } from "./Components/CreditModal";
import ViewCount from "./ViewCount/ViewCount";

export function Footer() {
  return (
    <div
      style={{
        backgroundColor: "#333",
        color: "#fff",
        paddingTop: "1rem",
        paddingBottom: "1rem",
        marginTop: "auto",
      }}
    >
      <Grid container>
        <Grid
          xs={12}
          sm={6}
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div>
            <h4>About</h4>

            <ul>
              <li>Ye Gaung Kyaw</li>
              <li>n10923543-CAB432</li>
              <li>Cloud Computing</li>
            </ul>
          </div>
        </Grid>
        <Grid
          xs={12}
          sm={6}
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div className="center">
            <h4> QuizzyTales &copy; 2023</h4>
            <div
              style={{
                display: "flex",
                justifyContent: "space-evenly",
              }}
            >
              <div
                style={{
                  border: "1px solid white",
                  borderRadius: "10px",
                  padding: "0.3rem",
                  textDecoration: "none",
                  color: "white",
                }}
              >
                <a
                  href={
                    "https://www.youtube.com/channel/UCg3e0tnKDyxW7nDNSYxhB9g"
                  }
                  target={"_blank"}
                  rel="noreferrer"
                  style={{
                    color: "white",
                  }}
                >
                  <YouTubeIcon fontSize="small" />
                </a>
              </div>
              <div
                style={{
                  border: "1px solid white",
                  borderRadius: "10px",
                  padding: "0.3rem",
                }}
              >
                <a
                  href={"https://www.linkedin.com/in/yegaungkyaw/"}
                  target={"_blank"}
                  rel="noreferrer"
                  style={{
                    color: "white",
                  }}
                >
                  <LinkedInIcon fontSize="small" />
                </a>
              </div>
              <div
                style={{
                  border: "1px solid white",
                  borderRadius: "10px",
                  padding: "0.3rem",
                }}
              >
                <a
                  href={"https://github.com/hikariakio/quizzytales/"}
                  target={"_blank"}
                  rel="noreferrer"
                  style={{
                    color: "white",
                  }}
                >
                  <GitHubIcon fontSize="small" />
                </a>
              </div>
            </div>
            <div
              style={{
                display: "grid",
                alignContent: "space-between",
                justifyContent: "center",
              }}
            >
              <CreditModal />
              {/*<ViewCount />*/}
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default Footer;
