import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { fetchConfig } from "../../utils/fetchConfig";
function ViewCount() {
  const [viewCount, setViewCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const hasFetched = useRef(false);

  useEffect(() => {
    (async () => {
      const backendURL = await fetchConfig();

      if (!hasFetched.current) {
        axios
          .get(`${backendURL}/viewcount`)
          .then((response) => {
            setViewCount(response.data);
            setLoading(false);
          })
          .catch((err) => {
            setError(err.message);
            setLoading(false);
          });

        hasFetched.current = true;
      }
    })();
  }, []);

  return (
    <>
      {loading ? (
        <span>
          <FaSpinner className="icon-spin" />
        </span>
      ) : (
        <span>
          <VisibilityOutlinedIcon fontSize="medium" />
          &nbsp;: {viewCount}
        </span>
      )}
    </>
  );
}

export default ViewCount;
