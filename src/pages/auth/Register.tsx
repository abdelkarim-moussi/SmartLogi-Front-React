import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { useToast } from "../../components/ui/Toast";
import api from "../../services/api";

export default function Register() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    nom: "",
    prenom: "",
    telephone: "",
    adresse: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.nom.trim()) newErrors.nom = "Last name is required";
    if (!formData.prenom.trim()) newErrors.prenom = "First name is required";
    if (!formData.telephone.trim())
      newErrors.telephone = "Phone number is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      showToast("error", "Please fill in all required fields correctly");
      return;
    }

    try {
      setIsSubmitting(true);
      await api.register({
        email: formData.email,
        password: formData.password,
        role: "CLIENT",
      });
      showToast("success", "Account created successfully! Please login.");
      navigate("/login");
    } catch (error) {
      showToast(
        "error",
        error instanceof Error ? error.message : "Registration failed",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 17h8M8 17a2 2 0 11-4 0 2 2 0 014 0zm8 0a2 2 0 102 0h-2zm-8 0h2m6 0h2"
                />
              </svg>
            </div>
            <span className="text-2xl font-bold text-white">SmartLogi</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          <p className="text-slate-400 mt-2">
            Start shipping with SmartLogi today
          </p>
        </div>

        {/* Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="John"
                value={formData.prenom}
                onChange={(e) =>
                  setFormData({ ...formData, prenom: e.target.value })
                }
                error={errors.prenom}
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
              />
              <Input
                label="Last Name"
                placeholder="Doe"
                value={formData.nom}
                onChange={(e) =>
                  setFormData({ ...formData, nom: e.target.value })
                }
                error={errors.nom}
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
              />
            </div>

            <Input
              label="Email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              error={errors.email}
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
            />

            <Input
              label="Phone Number"
              placeholder="+212 600 000 000"
              value={formData.telephone}
              onChange={(e) =>
                setFormData({ ...formData, telephone: e.target.value })
              }
              error={errors.telephone}
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
            />

            <Input
              label="Address (Optional)"
              placeholder="Your address"
              value={formData.adresse}
              onChange={(e) =>
                setFormData({ ...formData, adresse: e.target.value })
              }
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              error={errors.password}
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              error={errors.confirmPassword}
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
            />

            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-slate-400 text-sm">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-indigo-400 font-semibold hover:text-indigo-300"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
