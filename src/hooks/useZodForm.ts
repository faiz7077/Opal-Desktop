/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { UseMutateFunction } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultValues, useForm } from "react-hook-form";
//@ts-ignore
import z from "zod";

export const useZodForm = <T extends z.ZodType<any>>(
  schema: T,
  mutation: UseMutateFunction,
  defaultValues?: DefaultValues<z.TypeOf<T>> | undefined
) => {
  const {
    register,
    watch,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onFormSubmit = handleSubmit(async (values) => mutation({ ...values }));

  return { register, watch, reset, onFormSubmit, errors };
};
