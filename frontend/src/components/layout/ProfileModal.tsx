"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";

interface ProfileModalProps {
  onClose: () => void;
}

const DELETE_REASONS = [
  "I no longer need this account",
  "I found a better platform",
  "Too many technical issues",
  "Privacy concerns",
  "Other",
];

export default function ProfileModal({ onClose }: ProfileModalProps) {
  const { user, updateUser, logout } = useAuthStore();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const { data } = await api.put("/auth/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      updateUser({ ...user!, avatar: data.avatar });
      setSuccess("Avatar updated!");
    } catch (err: any) {
      setError("Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteReason) return setError("Please select a reason");
    setDeleting(true);
    try {
      await api.delete("/auth/account", { data: { reason: deleteReason } });
      logout();
      router.push("/");
    } catch (err: any) {
      setError("Failed to delete account");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold text-gray-900 mb-6">My Profile</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

        {!showDeleteConfirm ? (
          <>
            {/* Avatar */}
            <div className="flex flex-col items-center gap-4 mb-8">
              <div className="relative w-24 h-24 rounded-full overflow-hidden bg-purple-100 flex items-center justify-center">
                {user?.avatar && user.avatar.startsWith("http") ? (
                  <Image
                    src={user.avatar}
                    alt="avatar"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-purple-600">
                    {user?.username?.[0]?.toUpperCase() || "U"}
                  </span>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />

              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full text-sm font-medium transition disabled:opacity-60"
              >
                {uploading ? "Uploading..." : "Upload / Change Photo"}
              </button>
            </div>

            {/* User info */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Username</span>
                <span className="text-sm font-medium text-gray-700">
                  {user?.username}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Email</span>
                <span className="text-sm font-medium text-gray-700">
                  {user?.email}
                </span>
              </div>
              {user?.contact && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Contact</span>
                  <span className="text-sm font-medium text-gray-700">
                    {user.contact}
                  </span>
                </div>
              )}
              {user?.gender && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Gender</span>
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {user.gender}
                  </span>
                </div>
              )}
            </div>

            {/* Delete account */}
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full border border-red-200 text-red-500 hover:bg-red-50 py-2.5 rounded-full text-sm font-medium transition"
            >
              Delete Account
            </button>
          </>
        ) : (
          /* Delete confirmation */
          <div>
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">⚠️</div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Delete your account?
              </h3>
              <p className="text-gray-400 text-sm">
                This action is permanent and cannot be undone.
              </p>
            </div>

            <div className="mb-4">
              <label className="text-sm text-gray-600 mb-1 block">
                Reason for leaving
              </label>
              <select
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-300 text-sm text-black"
              >
                <option value="">Select a reason...</option>
                {DELETE_REASONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setError("");
                }}
                className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 py-2.5 rounded-full text-sm font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting || !deleteReason}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-full text-sm font-semibold transition disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
