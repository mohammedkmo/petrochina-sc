"use client";

import React from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";

interface NumberInputProps {
    value: string;
    onChange: (value: string) => void;
    min?: number;
    max?: number;
    step?: number;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    id?: string;
}

const NumberInput: React.FC<NumberInputProps> = ({
    value,
    onChange,
    min = 0,
    max = 999,
    step = 1,
    placeholder = "0",
    className,
    disabled = false,
    id,
}) => {
    const locale = useLocale();
    const isRTL = locale === "ar";
    const numericValue = parseInt(value) || 0;

    const handleIncrement = () => {
        const newValue = Math.min(numericValue + step, max);
        onChange(newValue.toString());
    };

    const handleDecrement = () => {
        const newValue = Math.max(numericValue - step, min);
        onChange(newValue.toString());
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;

        // Allow empty string for better UX
        if (inputValue === "") {
            onChange("");
            return;
        }

        // Only allow numbers
        if (!/^\d+$/.test(inputValue)) {
            return;
        }

        const numValue = parseInt(inputValue);

        // Ensure value is within bounds
        if (numValue >= min && numValue <= max) {
            onChange(inputValue);
        } else if (numValue < min) {
            onChange(min.toString());
        } else if (numValue > max) {
            onChange(max.toString());
        }
    };

    const handleBlur = () => {
        // Ensure we have a valid value on blur
        if (value === "" || isNaN(numericValue)) {
            onChange(min.toString());
        }
    };

    return (
        <div className={cn("flex items-center", className)}>
            {isRTL ? (
                // RTL Layout: Plus button on the left, Minus button on the right
                <>

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleDecrement}
                        disabled={disabled || numericValue <= min}
                        className="h-10 w-10 rounded-l-none border-l-0 p-0"
                    >
                        <Minus className="h-4 w-4" />
                    </Button>

                    <Input
                        id={id}
                        type="text"
                        value={value}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder={placeholder}
                        disabled={disabled}
                        className="h-10 rounded-none border-x-0 text-center font-medium"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        dir="ltr"
                    />

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleIncrement}
                        disabled={disabled || numericValue >= max}
                        className="h-10 w-10 rounded-r-none border-r-0 p-0"
                    >
                        <Plus className="h-4 w-4" />
                    </Button>


                </>
            ) : (
                // LTR Layout: Minus button on the left, Plus button on the right
                <>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleDecrement}
                        disabled={disabled || numericValue <= min}
                        className="h-10 w-10 rounded-r-none border-r-0 p-0"
                    >
                        <Minus className="h-4 w-4" />
                    </Button>

                    <Input
                        id={id}
                        type="text"
                        value={value}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder={placeholder}
                        disabled={disabled}
                        className="h-10 rounded-none border-x-0 text-center font-medium"
                        inputMode="numeric"
                        pattern="[0-9]*"
                    />

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleIncrement}
                        disabled={disabled || numericValue >= max}
                        className="h-10 w-10 rounded-l-none border-l-0 p-0"
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </>
            )}
        </div>
    );
};

export default NumberInput;
