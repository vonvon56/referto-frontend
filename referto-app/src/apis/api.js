import { instance, instanceWithToken } from "./axios";

// User 관련 API들
export const signIn = async (data) => {
  const response = await instance.post("/user/auth/", data);
  if (response.status === 200) {
  } else {
    console.log("[ERROR] error while signing in");
  }
};

export const signUp = async (data) => {
  const response = await instance.post("/user/register/", data);
  if (response.status === 200 || response.status === 201) {
    return response.data;
  } else {
    console.log("[ERROR] error while signing up");
  }
  return response;
};

export const getUser = async () => {
  try {
    const response = await instanceWithToken.get("/user/auth/");
    console.log("USER GET SUCCESS");
    return response.data;
  } catch (error) {
    console.error("[ERROR] error while getting user:", error);
    throw error;
  }
};

// Assignments 관련 API들
export const getAssignments = async () => {
  const response = await instanceWithToken.get("/assignments/");
  if (response.status === 200) {
    console.log("ASSIGNMENTS GET SUCCESS");
    return response.data;
  } else {
    console.log("[ERROR] error while getting assignments");
  }
};

export const createAssignment = async (data) => {
  const response = await instanceWithToken.post("/assignments/", data);
  if (response.status === 201) {
    console.log("ASSIGNMENT CREATE SUCCESS");
    return response.data;
  } else {
    console.log("[ERROR] error while creating assignment");
  }
};

export const updateAssignment = async (id, data) => {
  const response = await instanceWithToken.put(`/assignments/${id}/`, data);
  if (response.status === 200) {
    console.log("ASSIGNMENT UPDATE SUCCESS");
    return response.data;
  } else {
    console.log("[ERROR] error while updating assignment");
  }
};

export const deleteAssignment = async (id) => {
  const response = await instanceWithToken.delete(`/assignments/${id}/`);
  if (response.status === 200) {
    console.log("ASSIGNMENT DELETE SUCCESS");
  } else {
    console.log("[ERROR] error while deleting assignment");
  }
};

export const getAssignment = async (id) => {
  const response = await instanceWithToken.get(`/assignments/${id}/`);
  if (response.status === 200) {
    console.log("ASSIGNMENTSTYLE GET SUCCESS");
    return response.data;
  } else {
    console.log("[ERROR] error while getting ASSIGNMENTSTYLE");
  }
};

// Papers 관련 API

export const uploadPaper = async (formData, config) => {
  const response = await instanceWithToken.post("/papers/", formData, config);
  if (response.status === 201) {
    console.log("PAPER UPLOAD SUCCESS");
    return response.data;
  } else {
    console.log("[ERROR] error while uploading paper");
  }
};

export const getPaper = async (paperId) => {
  try {
    const response = await instanceWithToken.get(`/papers/${paperId}/`, {
      responseType: "blob",
    });

    if (response.status === 200) {
      console.log("PAPER GET SUCCESS");
      const blob = response.data;
      return URL.createObjectURL(blob);
    } else {
      console.log("[ERROR] Error while getting PAPER");
    }
  } catch (error) {
    console.error("Failed to fetch the paper:", error);
  }
};

export const deletePaper = async (paper_id) => {
  const response = await instanceWithToken.delete(`/papers/${paper_id}/`);
  if (response.status === 204) {
    console.log("PAPER DELETE SUCCESS");
  } else {
    console.log("[ERROR] error while deleting paper");
  }
};

// PaperInfos AI 생성 관련 API들

export const uploadPaperInfo = async (paper_id) => {
  const response = await instanceWithToken.post(`/paperinfo/${paper_id}/`);
  if (response.status === 200) {
    console.log("PAPERINFO UPLOAD SUCCESS");
    return response.data;
  } else {
    console.log("[ERROR] error while uploading paperinfo");
  }
};

export const updatePaperInfo = async (paper_id, data) => {
  const response = await instanceWithToken.put(`/paperinfo/${paper_id}/`, data);
  if (response.status === 200) {
    console.log("PAPERINFO UPDATE SUCCESS");
    return response.data;
  } else {
    console.log("[ERROR] error while updating paperinfo");
  }
};

// PaperInfos 사람이 조회, 수정, 삭제 관련 API들

export const getPaperInfos = async (assignment_id) => {
  try {
    const response = await instanceWithToken.get(`/paperinfo/assignment/${assignment_id}/`);
    if (response.status === 200) {
      console.log("PAPERINFOS GET SUCCESS");
      return response.data;
    }
    throw new Error("Failed to get paper infos");
  } catch (error) {
    console.error("[ERROR] error while getting PAPERINFOS:", error);
    throw error;
  }
};

export const getPaperInfo = async (assignment_id, paper_id) => {
  const response = await instanceWithToken.get(
    `/paperinfo/assignment/${assignment_id}/${paper_id}/`
  );
  if (response.status === 200) {
    console.log("PAPERINFO GET SUCCESS");
    return response.data;
  } else {
    console.log("[ERROR] error while getting PAPERINFO");
  }
};

// Memos 관련 API들

export const getMemo = async (paperId) => {
  const response = await instanceWithToken.get(`/papers/${paperId}/memo/`);
  return response.data;
};

export const createMemo = async (paperId, data) => {
  const response = await instanceWithToken.post(
    `/papers/${paperId}/memo/`,
    data
  );
  if (response.status === 201) {
    console.log("MEMO SUCCESS");
    return response.data;
  } else {
    console.log("[ERROR] error while creating memo");
  }
};

export const updateMemo = async (paperId, data) => {
  const response = await instanceWithToken.put(
    `/papers/${paperId}/memo/`,
    data
  );
  if (response.status === 200) {
    console.log("MEMO UPDATE SUCCESS");
    return response.data;
  } else {
    console.log("[ERROR] error while updating memo");
  }
};


// 랜딩 페이지 테스트 api
export const testUploadPaper = async (formData, config) => {
  try {
    const response = await instance.post("/papers/landingpage/", formData, config);
    if (response.status === 200 || response.status === 201) {
      console.log("TEST PAPER UPLOAD SUCCESS");
      return response;
    }
    throw new Error("Upload failed");
  } catch (error) {
    console.error("[ERROR] error while uploading test paper:", error);
    throw error;
  }
};

// 소셜 로그인 API들
export const googleSignIn = async () => {
  const backendUrl = process.env.NODE_ENV === 'production' 
    ? 'https://ec2-43-201-56-176.ap-northeast-2.compute.amazonaws.com'
    : 'http://localhost:8000';
    
  console.log('[GoogleSignIn] Environment:', process.env.NODE_ENV);
  console.log('[GoogleSignIn] Backend URL:', backendUrl);
  
  const redirectUri = `${backendUrl}/api/user/google/login/`;
  console.log('[GoogleSignIn] Redirect URI:', redirectUri);
  window.location.href = redirectUri;
};

export const naverSignIn = async () => {
  const redirectUri = `${process.env.REACT_APP_API_URL}/user/naver/login/`;
  window.location.href = redirectUri;
};

export const kakaoSignIn = async () => {
  const redirectUri = `${process.env.REACT_APP_API_URL}/user/kakao/login/`;
  window.location.href = redirectUri;
};
