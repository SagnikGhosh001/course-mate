// redux/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
import { toast } from "sonner";

interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string | null
    role: string;
    gender: string;
    createdAt: Date;
    updatedAt: Date;
}
// Define the expected response from the backend (adjust based on your API)
interface BackendResponse {
    success: boolean
    message: string
    user?:User
}

// Define the auth state type
interface AuthState {
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
    user?:User | null
}

// Initial state
const initialState: AuthState = {
    status: "idle",
    error: null,
    user: null
};


export const sendOtp = createAsyncThunk<
    { message: string },
    string,
    { rejectValue: string }
>("auth/sendotp", async (email, { rejectWithValue }) => {
    try {
        const response = await axios.put("/api/users/send-otp",
            {email}
        )
        return response.data
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            toast.error(error.response.data.message);
            // Handle Axios-specific errors with response data
            return rejectWithValue(error.response.data.message || "Failed to submit form");
        }
        toast.error("some error occured");
        return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
    }
});
export const verifyOtp = createAsyncThunk<
    { message: string },
    { email: string, verifiedOtp: string },
    { rejectValue: string }
>("auth/verifyotp", async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post("/api/users/verify-account",
            userData
        )
        return response.data
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            toast.error(error.response.data.message);
            // Handle Axios-specific errors with response data
            return rejectWithValue(error.response.data.message || "Failed to submit form");
        }
        toast.error("some error occured");
        return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
    }
});

export const emailUnique = createAsyncThunk<
    { message: string },
    { email: string },
    { rejectValue: string }
>("auth/emailUnique", async (email, { rejectWithValue }) => {
    try {
        const response = await axios.get(`/api/users/checkemail-unique?email=${email}`)
        return response.data
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            toast.error(error.response.data.message);
            // Handle Axios-specific errors with response data
            return rejectWithValue(error.response.data.message || "Failed to submit form");
        }
        toast.error("some error occured");
        return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
    }
});
export const getuserbyid = createAsyncThunk<
    { message: string },
    string,
    { rejectValue: string }
>("auth/getuserbyid", async (id, { rejectWithValue }) => {
    try {
        const response = await axios.get(`/api/users/getUserById/${id}`)
        return response.data
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            toast.error(error.response.data.message);
            // Handle Axios-specific errors with response data
            return rejectWithValue(error.response.data.message || "Failed to submit form");
        }
        toast.error("some error occured");
        return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
    }
});

// Async thunk for submitting submitCreateAdminOrCreatorForm form to backend
export const submitCreateAdminOrCreatorForm = createAsyncThunk<
    { message: string },
    { name: string; email: string; password: string; gender: string,role:string },
    { rejectValue: string }
>("auth/submitCreateAdminOrCreatorForm", async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post<BackendResponse>(
            "/api/users/adminCreator-signup",
            userData
        );

        return response.data;
    } catch (error) {

        if (axios.isAxiosError(error) && error.response) {
            toast.error(error.response.data.message);
            // Handle Axios-specific errors with response data
            return rejectWithValue(error.response.data.message || "Failed to submit form");
        }
        toast.error("some error occured");
        return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
    }
});

// Async thunk for submitting signup form to backend
export const submitSignupForm = createAsyncThunk<
    { message: string },
    { name: string; email: string; password: string; gender: string },
    { rejectValue: string }
>("auth/submitSignupForm", async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post<BackendResponse>(
            "/api/users/sign-up",
            userData
        );

        return response.data;
    } catch (error) {

        if (axios.isAxiosError(error) && error.response) {
            toast.error(error.response.data.message);
            // Handle Axios-specific errors with response data
            return rejectWithValue(error.response.data.message || "Failed to submit form");
        }
        toast.error("some error occured");
        return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(submitSignupForm.pending, (state) => {
                state.status = "loading";
                state.error = null; // Clear previous errors
            })
            .addCase(submitSignupForm.fulfilled, (state) => {
                state.status = "succeeded";
            })
            .addCase(submitSignupForm.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string || "An error occurred";
            })
            .addCase(submitCreateAdminOrCreatorForm.pending, (state) => {
                state.status = "loading";
                state.error = null; // Clear previous errors
            })
            .addCase(submitCreateAdminOrCreatorForm.fulfilled, (state) => {
                state.status = "succeeded";
            })
            .addCase(submitCreateAdminOrCreatorForm.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string || "An error occurred";
            })
            .addCase(emailUnique.pending, (state) => {
                state.status = "loading";
                state.error = null; // Clear previous errors
            })
            .addCase(emailUnique.fulfilled, (state) => {
                state.status = "succeeded";
            })
            .addCase(emailUnique.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string || "An error occurred";
            })
            .addCase(verifyOtp.pending, (state) => {
                state.status = "loading";
                state.error = null; // Clear previous errors
            })
            .addCase(verifyOtp.fulfilled, (state) => {
                state.status = "succeeded";
            })
            .addCase(verifyOtp.rejected, (state, action) => {


                state.status = "failed";
                state.error = action.payload as string || "An error occurred";
            })
            .addCase(sendOtp.pending, (state) => {
                state.status = "loading";
                state.error = null; // Clear previous errors
            })
            .addCase(sendOtp.fulfilled, (state) => {
                state.status = "succeeded";
            })
            .addCase(sendOtp.rejected, (state, action) => {


                state.status = "failed";
                state.error = action.payload as string || "An error occurred";
            });
    },
});


export default authSlice.reducer;