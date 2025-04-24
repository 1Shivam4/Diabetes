const API_URL = import.meta.env.VITE_BACKEND_URL;

const userId = () => {
  return "";
};

function authHeader() {
  let token = localStorage.getItem("userToken");

  if (token) {
    return { Authorization: "Bearer " + token };
  } else {
    return {};
  }
}

async function makeRequest(endpoint, data, addUId = true, method = "Post") {
  const reqOption = {
    method: method,
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(data),
  };

  let callEndPoint = addUId
    ? `${API_URL}/${endpoint}/${userId()}`
    : `${API_URL}/${endpoint}`;
  try {
    const response = await fetch(callEndPoint, reqOption);

    if (
      !response ||
      response?.status === "error" ||
      response?.status === "fail"
    ) {
      return {
        status: "error",
        message: responseData.message || `HTTP Error ${response.status}`,
      };
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.log(error);
    return {
      status: "error",
      message: "Something went wrong",
    };
  }
}

async function makeRequestWithForm(
  endpoint,
  formData,
  addUId = true,
  method = "Post"
) {
  const reqOption = {
    method: method,
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(formData),
  };

  let callEndPoint = addUId
    ? `${API_URL}/${endpoint}/${userId()}`
    : `${API_URL}/${endpoint}`;

  try {
    const response = await fetch(callEndPoint, reqOption);
    console.log(response);

    if (
      !response ||
      response?.status === "error" ||
      response?.status === "fail"
    ) {
      return {
        status: "error",
        message: responseData.message || `HTTP Error ${response.status}`,
      };
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.log(error);
    return {
      status: "error",
      message: "Something went wrong",
    };
  }
}

async function makeGetRequest(endpoint, addUId = false) {
  const reqOption = {
    method: "get",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
  };

  let callEndPoint = addUId
    ? `${API_URL}/${endpoint}/${userId()}`
    : `${API_URL}/${endpoint}`;

  try {
    const response = await fetch(callEndPoint, reqOption);
    const responseData = await response.json();

    if (
      !response ||
      response?.status === "error" ||
      response?.status === "fail"
    ) {
      return {
        status: "error",
        message: responseData.message || `HTTP Error ${response.status}`,
      };
    }

    return responseData;
  } catch (error) {
    console.log(error);
    return {
      status: "error",
      message: "Something went wrong",
    };
  }
}

export const RegisterUser = ({ name, email, password, confirmPassword }) => {
  return makeRequest(
    "user/signup",
    { name, email, password, confirmPassword },
    false
  );
};

export const deleteReport = async (reportID) => {
  return makeRequest(`test/${reportID}`, { reportID }, true, "delete");
};

export const getSingleReport = async (reportID) => {
  return makeGetRequest(`test/${reportID}`, true);
};

export const getAllTestData = async () => {
  return makeGetRequest("test/all", true);
};

export const getAverageTestData = async () => {
  return makeGetRequest("test", true);
};

export const LoginUser = ({ email, password }) => {
  return makeRequest("user/login", { email, password }, false);
};

export const LogoutUser = () => {
  return makeGetRequest("user/logout");
};

// Blogs
export const GetBlogs = () => {
  return makeGetRequest("blog");
};
export const CreateTest = (data) => {
  return makeRequestWithForm("test", data, false);
};
