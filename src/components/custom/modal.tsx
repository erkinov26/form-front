import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
} from "../ui/animated-modal";
import { motion } from "framer-motion";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface ErrorResponse {
  response: {
    data: {
      error: string;
    };
  };
}

export function AnimatedModal({
  setIsSuccess,
}: {
  setIsSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [formData, setFormData] = useState({ name: "", phone: "" });
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nameFromUrl = params.get("name");
    const phoneFromUrl = params.get("phone");

    if (nameFromUrl) setFormData((prev) => ({ ...prev, name: nameFromUrl }));
    if (phoneFromUrl) setFormData((prev) => ({ ...prev, phone: phoneFromUrl }));
  }, []);

  const [errors, setErrors] = useState<null | string>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors(null);
  };

  const { isPending, mutate, isSuccess } = useMutation({
    mutationFn: async (data: { ism: string; telefon: string }) => {
      const res = await axios.post("https://form-api.nordicuniversity.org/sampleusers", data);
      return res.data;
    },
    onSuccess: () => {
      setFormData({ name: "", phone: "" });
    },
    onError: (error: ErrorResponse) => {
      console.log(error);
      setErrors(error.response?.data.error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim()) {
      setErrors("Iltimos, barcha maydonlarni to‘ldiring.");
      return;
    }

    mutate({ ism: formData.name, telefon: formData.phone });
  };

  useEffect(() => {
    if (isSuccess) {
      setIsSuccess(true);
    }
  }, [isSuccess, setIsSuccess]);

  return (
    <Modal>
      <motion.div
        initial={{ opacity: 0, x: -200 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, delay: 0.1 }}
        className="text-white text-center font-semibold sm:w-auto w-full sm:py-[1vw] sm:px-[6vw] py-[5vw] z-50 relative sm:mt-0 hover:opacity-90 transition sm:text-[2vw] text-[6vw] rounded-[100px]"
        style={{
          background:
            "linear-gradient(90deg, #027D1D 0%, #31BA4F 48.08%, #007B1B 100%)",
        }}
      >
        <ModalTrigger>
          <span className="text-white">RO‘YXATDAN O‘TISH</span>
        </ModalTrigger>
      </motion.div>
      <ModalBody className="rounded-lg">
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <div>
              <Label>Ism</Label>
              <Input
                name="name"
                type="text"
                autoComplete="name"
                required
                placeholder="Ismingizni kiriting"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="my-4">
              <Label>Telefon Raqam</Label>
              <Input
                name="phone"
                autoComplete="tel"
                type="tel"
                required
                placeholder="Telefon raqamingizni kiriting"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="text-white cursor-pointer font-semibold w-full py-[15px] rounded-[100px] disabled:opacity-50"
              style={{
                background:
                  "linear-gradient(90deg, #027D1D 0%, #31BA4F 48.08%, #007B1B 100%)",
              }}
            >
              {isPending ? "Yuborilmoqda..." : "RO‘YXATDAN O‘TISH"}
            </button>
          </form>
        </ModalContent>

        {errors && (
          <ModalFooter>
            <p className="text-red-500 w-full text-sm text-center">{errors}</p>
          </ModalFooter>
        )}
      </ModalBody>
    </Modal>
  );
}
