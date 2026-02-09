import { SxProps } from "@mui/material";
import { CSSProperties } from "react";

export type TFormFieldConfig<T> = {
    name: keyof T;
    label: string;
    type: 'text' | 'number' | 'toggle' | 'quill' | 'date' | 'password' | 'email' | 'dropdown';
    style?:CSSProperties,
    sxProps?:SxProps,
    placeholder?: string;
    required?: boolean;
    maxLength?:number,
    options?:{
          key:string,
      label:string
    }[]
    icon?: {
      [x:string]:React.ReactNode
    };
  };