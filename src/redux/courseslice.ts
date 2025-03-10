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
interface Usercourses {
    user: {
        id: string,
        name: string,
        email: string,
        avatar: string
    }
}
interface Reviews {
    rating: number
    message: string
    createdAt: Date
    updatedAt: Date
    owner: {
        name: string
        avatar?: string
        email: string
    }
}

interface CourseContent {
    id: string
    title: string,
    description: string
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
    _count: {
        courseContent?: number
        reviews?: number
        usercourses?: number,
    }
    owner: {
        id: string
        name: string,
        email?: string,
        avatar?: string,
        _count: {
            ownedcourses: number
        }
    },
    reviews?: Reviews[],
    courseContent: CourseContent[],
    usercourses?: Usercourses[]

    topic: Topic
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
    course: Course | null
    ownedCourses: Course[]
}

// Initial state
const initialState: AuthState = {
    status: "idle",
    error: null,
    courses: [],
    userCourses: [],
    course: null,
    ownedCourses: []
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
export const joinCourse = createAsyncThunk<
    BackendResponse,
    string,
    { rejectValue: string }
>("course/joinCourse", async (id, { rejectWithValue }) => {
    try {
        const response = await axios.post<BackendResponse>(
            `/api/course/join-course/${id}`
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
export const addToCart = createAsyncThunk<
    BackendResponse,
    {courseid:string},
    { rejectValue: string }
>("cart/addToCart", async (id, { rejectWithValue }) => {
    try {
        const response = await axios.post<BackendResponse>(
            "/api/cart/add-cart",
            id
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
export const updateCourse = createAsyncThunk<
    BackendResponse,
    { title: string; description: string; type: string; price: string; topicId: string, courseid: string },
    { rejectValue: string }
>("course/updateCourse", async (courseData, { rejectWithValue }) => {
    try {
        const response = await axios.put<BackendResponse>(
            `/api/course/updateCourse/${courseData.courseid}`,
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
export const addCourseContent = createAsyncThunk<
    BackendResponse,
    { courseid: string; title: string; description: string },
    { rejectValue: string }
>("course/addCourseContent", async (contentData, { rejectWithValue }) => {
    try {
        const response = await axios.post<BackendResponse>("/api/courseContent/addCourseContent", contentData);
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return rejectWithValue(error.response.data.message || "Failed to add course content");
        }
        return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
    }
});
export const getCourseById = createAsyncThunk<
    BackendResponse,
    string,
    { rejectValue: string }
>("course/getCourseById", async (courseid, { rejectWithValue }) => {
    try {
        const response = await axios.get<BackendResponse>(
            `/api/course/courseById/${courseid}`,
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
            .addCase(joinCourse.pending, (state) => {
                state.status = "loading";
                state.error = null; // Clear previous errors
            })
            .addCase(joinCourse.fulfilled, (state, action) => {
                state.status = "succeeded";
            })
            .addCase(joinCourse.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string || "An error occurred";
            })
            .addCase(addToCart.pending, (state) => {
                state.status = "loading";
                state.error = null; // Clear previous errors
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.status = "succeeded";
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string || "An error occurred";
            })
            .addCase(updateCourse.pending, (state) => {
                state.status = "loading";
                state.error = null; // Clear previous errors
            })
            .addCase(updateCourse.fulfilled, (state, action) => {
                state.status = "succeeded";
                // if (action.payload.course) {
                //     state.course=action.payload.course // Add new topic to list
                // }
            })
            .addCase(updateCourse.rejected, (state, action) => {
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
            })
            .addCase(getCourseById.pending, (state) => {
                state.status = "loading";
                state.error = null; // Clear previous errors
            })
            .addCase(getCourseById.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.course = action.payload.course || null
            })
            .addCase(getCourseById.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string || "An error occurred";
            })
            .addCase(addCourseContent.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(addCourseContent.fulfilled, (state, action) => {
                state.status = "succeeded";
            })
            .addCase(addCourseContent.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || "An error occurred";
            });
    },
});


export default courseslice.reducer;