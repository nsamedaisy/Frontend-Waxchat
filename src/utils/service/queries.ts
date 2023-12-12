import { supabase } from "../supabase/client";
import { SITE_URL } from "./constant";
import ApiCall from "./httpClient";
import { LOCAL_STORAGE } from "./storage";

const apiCall = new ApiCall();

export const signUp = (newUser: {
  name: string;
  email: string;
  image: string;
}) => {
  return apiCall.POST(SITE_URL + "users", newUser);
};

// GET ALL USERS
export const getAllUsers = async () => {
  const res = await fetch(SITE_URL + "/users", { next: { revalidate: 3600 } });
  return await res.json();
};

// GET CURRENT USER
export const getCurrentUser = async () => {
  const id = LOCAL_STORAGE.get("userId");
  if (id) {
    const res = await fetch(SITE_URL + `/users/${id}`);
    return await res.json();
  }
};

// CREATE CHAT ROOM
export const createRoom = async (user: {
  name: string;
  email: string;
  image?: string;
  isGroup: boolean;
  user_id: string;
  my_id: string;
}) => {
  return apiCall.POST(SITE_URL + "/rooms", user);
};

// GET ALL ROOMS

export const getAllRooms = async () => {
  const id = LOCAL_STORAGE.get("userId");
  const res = await fetch(SITE_URL + `/rooms/my_dm/${id}`, {
    next: { revalidate: 3000 },
  });

  return await res.json();
};

// UPLOAD IMAGE TO SUPABSE
export const uplaodImage = async (file: any) => {
  const fileValue = `groupIcon${Date.now()}.png`;

  const { data, error } = await supabase.storage
    .from("whatsapp_avatars/images")
    .upload(fileValue, file);

  if (error) {
    console.error("error creatin group icon", error);
  } else {
    console.log("group icon data", data);
    const imageUrl = supabase.storage
      .from("whatsapp_avatars/images")
      .getPublicUrl(data.path);
    console.log("group icon download url", imageUrl.data.publicUrl);
    return imageUrl.data.publicUrl;
  }
};


//upload all file types to supabase 
// export const uploadFileToSupabase = async (file: File) => {
//   const fileName = `file_${Date.now()}.${file.name.split('.').pop()}`;

//   const { data, error } = await supabase.storage
//     .from("your_bucket_name")
//     .upload(fileName, file);

//   if (error) {
//     console.error("Error uploading file to Supabase:", error);
//   } else {
//     const fileUrl = supabase.storage
//       .from("your_bucket_name")
//       .getPublicUrl(data.path);
//     console.log("File download URL:", fileUrl);
//     return fileUrl;
//   }
// };
