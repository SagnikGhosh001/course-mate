// redux/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
import { toast } from "sonner";


// Define the expected response from the backend (adjust based on your API)
interface SignupResponse {
    message: string
}

// Define the auth state type
interface AuthState {
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;

}

// Initial state
const initialState: AuthState = {
    status: "idle",
    error: null,
};

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

// Async thunk for submitting signup form to backend
export const submitSignupForm = createAsyncThunk<
    { message: string },
    { name: string; email: string; password: string; gender: string },
    { rejectValue: string }
>("auth/submitSignupForm", async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post<SignupResponse>(
            "http://localhost:3000/api/users/sign-up",
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
            .addCase(submitSignupForm.rejected, (state) => {
                state.status = "failed";
                state.error = "An error occurred";
            })
            .addCase(emailUnique.pending, (state) => {
                state.status = "loading";
                state.error = null; // Clear previous errors
            })
            .addCase(emailUnique.fulfilled, (state) => {
                state.status = "succeeded";
            })
            .addCase(emailUnique.rejected, (state) => {
                state.status = "failed";
                state.error = "An error occurred";
            });
    },
});


export default authSlice.reducer;