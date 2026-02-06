import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import Login from "./Login";

// Mock the hooks
const mockLogin = vi.fn();
const mockShowToast = vi.fn();
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({
    login: mockLogin,
    user: null,
    isAuthenticated: false,
    isLoading: false,
    logout: vi.fn(),
    hasRole: vi.fn(),
  }),
}));

vi.mock("../../components/ui/Toast", () => ({
  useToast: () => ({
    showToast: mockShowToast,
    toasts: [],
    removeToast: vi.fn(),
  }),
}));

// Wrapper component with Router
const renderLogin = () => {
  return render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
};

describe("Login Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render the login form", () => {
      renderLogin();

      expect(screen.getByText("Welcome Back")).toBeInTheDocument();
      expect(screen.getByText("Sign in to your account")).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
    });

    it("should render the SmartLogi logo", () => {
      renderLogin();

      expect(screen.getByText("SmartLogi")).toBeInTheDocument();
    });

    it("should render remember me checkbox", () => {
      renderLogin();

      expect(screen.getByText("Remember me")).toBeInTheDocument();
      expect(screen.getByRole("checkbox")).toBeInTheDocument();
    });

    it("should render forgot password link", () => {
      renderLogin();

      expect(screen.getByText("Forgot password?")).toBeInTheDocument();
    });

    it("should render sign up link", () => {
      renderLogin();

      expect(screen.getByText("Create one here")).toBeInTheDocument();
    });

    it("should render Google sign-in button", () => {
      renderLogin();

      expect(screen.getByText("Sign in with Google")).toBeInTheDocument();
    });
  });

  describe("Form Validation", () => {
    it("should show error toast when email is empty", async () => {
      renderLogin();

      const submitButton = screen.getByRole("button", { name: /sign in/i });
      fireEvent.click(submitButton);

      expect(mockShowToast).toHaveBeenCalledWith(
        "error",
        "Please fill in all fields"
      );
      expect(mockLogin).not.toHaveBeenCalled();
    });

    it("should show error toast when password is empty", async () => {
      renderLogin();
      const user = userEvent.setup();

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, "test@example.com");

      const submitButton = screen.getByRole("button", { name: /sign in/i });
      fireEvent.click(submitButton);

      expect(mockShowToast).toHaveBeenCalledWith(
        "error",
        "Please fill in all fields"
      );
      expect(mockLogin).not.toHaveBeenCalled();
    });

    it("should show error toast when both fields are empty", async () => {
      renderLogin();

      const submitButton = screen.getByRole("button", { name: /sign in/i });
      fireEvent.click(submitButton);

      expect(mockShowToast).toHaveBeenCalledWith(
        "error",
        "Please fill in all fields"
      );
    });
  });

  describe("Form Submission", () => {
    it("should call login with email and password", async () => {
      mockLogin.mockResolvedValueOnce(undefined);
      renderLogin();
      const user = userEvent.setup();

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");

      const submitButton = screen.getByRole("button", { name: /sign in/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith("test@example.com", "password123");
      });
    });

    it("should show success toast on successful login", async () => {
      mockLogin.mockResolvedValueOnce(undefined);
      localStorage.setItem("user", JSON.stringify({ role: "CLIENT" }));

      renderLogin();
      const user = userEvent.setup();

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");

      const submitButton = screen.getByRole("button", { name: /sign in/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith("success", "Login successful!");
      });
    });

    it("should show error toast on failed login", async () => {
      const errorMessage = "Invalid credentials";
      mockLogin.mockRejectedValueOnce(new Error(errorMessage));

      renderLogin();
      const user = userEvent.setup();

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "wrongpassword");

      const submitButton = screen.getByRole("button", { name: /sign in/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith("error", errorMessage);
      });
    });

    it("should show generic error message when error is not an Error instance", async () => {
      mockLogin.mockRejectedValueOnce("Unknown error");

      renderLogin();
      const user = userEvent.setup();

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");

      const submitButton = screen.getByRole("button", { name: /sign in/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith("error", "Login failed");
      });
    });
  });

  describe("Navigation after Login", () => {
    it("should navigate to /admin for ADMIN role", async () => {
      mockLogin.mockResolvedValueOnce(undefined);
      localStorage.setItem("user", JSON.stringify({ role: "ADMIN" }));

      renderLogin();
      const user = userEvent.setup();

      await user.type(screen.getByLabelText(/email/i), "admin@example.com");
      await user.type(screen.getByLabelText(/password/i), "password123");

      fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/admin");
      });
    });

    it("should navigate to /manager for MANAGER role", async () => {
      mockLogin.mockResolvedValueOnce(undefined);
      localStorage.setItem("user", JSON.stringify({ role: "MANAGER" }));

      renderLogin();
      const user = userEvent.setup();

      await user.type(screen.getByLabelText(/email/i), "manager@example.com");
      await user.type(screen.getByLabelText(/password/i), "password123");

      fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/manager");
      });
    });

    it("should navigate to /client for CLIENT role", async () => {
      mockLogin.mockResolvedValueOnce(undefined);
      localStorage.setItem("user", JSON.stringify({ role: "CLIENT" }));

      renderLogin();
      const user = userEvent.setup();

      await user.type(screen.getByLabelText(/email/i), "client@example.com");
      await user.type(screen.getByLabelText(/password/i), "password123");

      fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/client");
      });
    });

    it("should navigate to /delivery for LIVREUR role", async () => {
      mockLogin.mockResolvedValueOnce(undefined);
      localStorage.setItem("user", JSON.stringify({ role: "LIVREUR" }));

      renderLogin();
      const user = userEvent.setup();

      await user.type(screen.getByLabelText(/email/i), "livreur@example.com");
      await user.type(screen.getByLabelText(/password/i), "password123");

      fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/delivery");
      });
    });

    it("should navigate to / for unknown role", async () => {
      mockLogin.mockResolvedValueOnce(undefined);
      localStorage.setItem("user", JSON.stringify({ role: "UNKNOWN" }));

      renderLogin();
      const user = userEvent.setup();

      await user.type(screen.getByLabelText(/email/i), "user@example.com");
      await user.type(screen.getByLabelText(/password/i), "password123");

      fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/");
      });
    });
  });

  describe("Loading State", () => {
    it("should update input values when typing", async () => {
      renderLogin();
      const user = userEvent.setup();

      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
      const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");

      expect(emailInput.value).toBe("test@example.com");
      expect(passwordInput.value).toBe("password123");
    });
  });
});
