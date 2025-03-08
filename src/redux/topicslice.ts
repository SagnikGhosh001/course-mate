// redux/topicslice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
import { toast } from "sonner";


// Topic interface
interface Topic {
    id: string;
    title: string;
    description: string;
    parentId: string | null;
    createdAt: Date
    updatedAt: Date
}

// Define the expected response from the backend (adjust based on your API)
interface BackendResponse {
    success: boolean
    message: string
    topic?: Topic
    topics?: Topic[]

}



// Define the auth state type
interface AuthState {
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
    topics: Topic[],
}

// Initial state
const initialState: AuthState = {
    status: "idle",
    error: null,
    topics: []
};




// Async thunk for submitting add topic form to backend
export const addTopic = createAsyncThunk<
    BackendResponse,
    { title: string; description: string; topicId: string },
    { rejectValue: string }
>("auth/addTopic", async (topicData, { rejectWithValue }) => {
    try {
        const response = await axios.post<BackendResponse>(
            "/api/topic/addTopic",
            topicData
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
export const getAllTopic = createAsyncThunk<
    BackendResponse,
    void, // No input data
    { rejectValue: string }
>("topic/getAllTopic", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get<BackendResponse>(
            "/api/topic/getAllTopic",
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

const topicslice = createSlice({
    name: "topic",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addTopic.pending, (state) => {
                state.status = "loading";
                state.error = null; // Clear previous errors
            })
            .addCase(addTopic.fulfilled, (state, action) => {
                state.status = "succeeded";
                if (action.payload.topic) {
                    state.topics.push(action.payload.topic); // Add new topic to list
                }
            })
            .addCase(addTopic.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string || "An error occurred";
            })
            .addCase(getAllTopic.pending, (state) => {
                state.status = "loading";
                state.error = null; // Clear previous errors
            })
            .addCase(getAllTopic.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.topics = action.payload.topics || []
            })
            .addCase(getAllTopic.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string || "An error occurred";
            });
    },
});


export default topicslice.reducer;