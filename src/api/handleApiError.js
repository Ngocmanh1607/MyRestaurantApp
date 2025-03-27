export default function handleApiError(error) {
    if (error.response) {
        // Lỗi từ backend (4xx, 5xx)
        console.error("Backend error:", error.response.data);
        if (error.response.status === 500) {
            return {
                success: false,
                message: 500,
            };
        }
        return {
            success: false,
            message: error.response.data.message || "Có lỗi xảy ra!",
        };
    } else if (error.request) {
        // Lỗi không nhận được phản hồi từ server
        console.error("No response from server:", error.request);
        return {
            success: false,
            message: "Không thể kết nối đến server. Vui lòng thử lại!",
        };
    } else {
        // Lỗi không xác định (lỗi cú pháp, lỗi mạng...)
        console.error("Unexpected error:", error.message);
        return {
            success: false,
            message: "Lỗi không xác định!",
        };
    }
}