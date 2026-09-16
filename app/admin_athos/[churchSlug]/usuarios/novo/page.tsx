"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUser } from "@/api-client/users";
import { getMyChurch } from "@/api-client/churches";
import { ApiError } from "@/api-client/client";
import { UserForm, type UserFormData } from "@/components/admin/UserForm";
import { FormPageHeader } from "@/components/admin/form-layout/FormPageHeader";

export default function NewUserPage({
  params,
}: {
  params: Promise<{ churchSlug: string }>;
}) {
  const { churchSlug } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: church } = useQuery({ queryKey: ["churches", "me"], queryFn: getMyChurch });

  const mutation = useMutation({
    mutationFn: (data: UserFormData) =>
      createUser({
        churchId: church!.id,
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      router.push(`/admin_athos/${churchSlug}/usuarios`);
    },
  });

  return (
    <div className="mx-auto max-w-4xl">
      <FormPageHeader
        title="Novo Usuário"
        backHref={`/admin_athos/${churchSlug}/usuarios`}
        backLabel="Usuários"
      />
      <UserForm
        onSubmit={(data) => mutation.mutate(data)}
        isSubmitting={mutation.isPending || !church}
        errorMessage={mutation.error instanceof ApiError ? mutation.error.message : undefined}
      />
    </div>
  );
}
