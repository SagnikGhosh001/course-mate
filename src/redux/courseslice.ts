// redux/courseslice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
import { toast } from "sonner";

interface Topic {
    id: string;
    title: string;
    description: string;
    parentId: string | null;
    createdAt: Date
    updatedAt: Date
}

// Topic interface
interface Course {
    id: string;
    title: string;
    description: string;
    price: string;
    type: string;
    createdAt: Date;
    updatedAt: Date;
    parentId: string | null;
    _count?: {
        courseContent?: number
        reviews?: number
        usercourses?: number,
    }
    owner?: {
        name: string,
        email?: string,
        avatar?: string,
        _count: {
            ownedcourses: number
        }
    },
    reviews?: [],
    courseContent?: [],
    topic:Topic
}

// Define the expected response from the backend (adjust based on your API)
interface BackendResponse {
    success: boolean
    message: string
    course?: Course
    courses?: Course[]
    ownedCourses?: Course[]
    topicCourses?: Course[]
    
}



// Define the auth state type
interface AuthState {
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
    courses: Course[];
    userCourses: Course[]
}

// Initial state
const initialState: AuthState = {
    status: "idle",
    error: null,
    courses: [],
    userCourses: []
};




// Async thunk for submitting add topic form to backend
export const addCourse = createAsyncThunk<
    BackendResponse,
    { title: string; description: string; type: string; price: string; topicId: string },
    { rejectValue: string }
>("course/addCourse", async (courseData, { rejectWithValue }) => {
    try {
        const response = await axios.post<BackendResponse>(
            "/api/course/addCourse",
            courseData
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
export const getAllCourse = createAsyncThunk<
    BackendResponse,
    void, // No input data
    { rejectValue: string }
>("course/getAllCourse", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get<BackendResponse>(
            "/api/course/getAllCourse",
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
export const getAllUserCourse = createAsyncThunk<
    BackendResponse,
    void, // No input data
    { rejectValue: string }
>("course/getAllUserCourse", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get<BackendResponse>(
            "/api/course/ownedCourse",
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

const courseslice = createSlice({
    name: "course",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addCourse.pending, (state) => {
                state.status = "loading";
                state.error = null; // Clear previous errors
            })
            .addCase(addCourse.fulfilled, (state, action) => {
                state.status = "succeeded";
                if (action.payload.course) {
                    state.courses.push(action.payload.course); // Add new topic to list
                }
            })
            .addCase(addCourse.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string || "An error occurred";
            })
            .addCase(getAllCourse.pending, (state) => {
                state.status = "loading";
                state.error = null; // Clear previous errors
            })
            .addCase(getAllCourse.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.courses = action.payload.courses || []
            })
            .addCase(getAllCourse.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string || "An error occurred";
            })
            .addCase(getAllUserCourse.pending, (state) => {
                state.status = "loading";
                state.error = null; // Clear previous errors
            })
            .addCase(getAllUserCourse.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.userCourses = action.payload.ownedCourses || []
            })
            .addCase(getAllUserCourse.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string || "An error occurred";
            });
    },
});


export default courseslice.reducer;