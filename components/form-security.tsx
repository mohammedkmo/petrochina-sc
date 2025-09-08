"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const FormSchema = z.object({
  // Letter Header
  headerImageUrl: z.string().optional(),
  
  // معلومات أساسية
  contractNumber: z.string().min(1, "رقم العقد مطلوب"),
  contractNumberArabic: z.string().optional(),
  idNumber: z.string().min(1, "رقم الهوية مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  phoneNumber: z.string().optional(),
  
  // معلومات الشركة
  companyNameEnglish: z.string().min(2, "Company Name (English) required"),
  companyNameArabic: z.string().min(2, "اسم الشركة مطلوب"),
  contractSubjectEnglish: z.string().min(1, "Contract Subject (English) required"),
  contractSubjectArabic: z.string().min(1, "موضوع العقد مطلوب"),
  contractedWithEnglish: z.string().min(1, "Contracted with (English) required"),
  contractedWithArabic: z.string().min(1, "متعاقد مع مطلوب"),
  
  // معلومات المدير
  managerName: z.string().min(2, "Manager Name required"),
  position: z.string().min(1, "Position required"),
  
  // معلومات التصريح
  fpPhone: z.string().optional(),
  fpPhoneArabic: z.string().optional(),
  clearanceTypeEnglish: z.string().min(1, "Clearance Type (English) required"),
  clearanceTypeArabic: z.string().min(1, "نوع التصريح مطلوب"),
  entryApprovalType: z.string().optional(),
  
  // المدة
  duration: z.string().optional(),
  durationArabic: z.string().optional(),
  
  // الأعداد
  numberOfIraqis: z.string().optional(),
  numberOfIraqisArabic: z.string().optional(),
  numberOfInternationals: z.string().optional(),
  numberOfInternationalsArabic: z.string().optional(),
  numberOfVehicles: z.string().optional(),
  numberOfVehiclesArabic: z.string().optional(),
  numberOfWeapons: z.string().optional(),
  numberOfWeaponsArabic: z.string().optional(),
  
  // التواريخ والفترات
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  startingDate: z.string().optional(),
  startingDateArabic: z.string().optional(),
  endDate: z.string().optional(),
  endDateArabic: z.string().optional(),
  contractPeriod: z.string().optional(),
  contractPeriodArabic: z.string().optional(),
  numberOfDaysEnglish: z.string().optional(),
  numberOfDaysArabic: z.string().optional(),
  
  // رسالة التخويل
  authorizedPersonName: z.string().optional(),
  authorizedPersonNameArabic: z.string().optional(),
  authorizedPersonId: z.string().optional(),
  authorizedPersonIdArabic: z.string().optional(),
  authorizationStartDate: z.string().optional(),
  authorizationStartDateArabic: z.string().optional(),
  authorizationEndDate: z.string().optional(),
  authorizationEndDateArabic: z.string().optional(),
  contactInfo: z.string().optional(),
  contactInfoArabic: z.string().optional(),
});

type FormValues = z.infer<typeof FormSchema>;

export default function SecurityForm() {
  const [loading, setLoading] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      // Letter Header
      headerImageUrl: "",
      
      // معلومات أساسية
      contractNumber: "",
      contractNumberArabic: "",
      idNumber: "",
      email: "",
      phoneNumber: "",
      
      // معلومات الشركة
      companyNameEnglish: "",
      companyNameArabic: "",
      contractSubjectEnglish: "",
      contractSubjectArabic: "",
      contractedWithEnglish: "",
      contractedWithArabic: "",
      
      // معلومات المدير
      managerName: "",
      position: "",
      
      // معلومات التصريح
      fpPhone: "",
      fpPhoneArabic: "",
      clearanceTypeEnglish: "",
      clearanceTypeArabic: "",
      entryApprovalType: "",
      
      // المدة
      duration: "",
      durationArabic: "",
      
      // الأعداد
      numberOfIraqis: "",
      numberOfIraqisArabic: "",
      numberOfInternationals: "",
      numberOfInternationalsArabic: "",
      numberOfVehicles: "",
      numberOfVehiclesArabic: "",
      numberOfWeapons: "",
      numberOfWeaponsArabic: "",
      
      // التواريخ والفترات
      fromDate: "",
      toDate: "",
      startingDate: "",
      startingDateArabic: "",
      endDate: "",
      endDateArabic: "",
      contractPeriod: "",
      contractPeriodArabic: "",
      numberOfDaysEnglish: "",
      numberOfDaysArabic: "",
      
      // رسالة التخويل
      authorizedPersonName: "",
      authorizedPersonNameArabic: "",
      authorizedPersonId: "",
      authorizedPersonIdArabic: "",
      authorizationStartDate: "",
      authorizationStartDateArabic: "",
      authorizationEndDate: "",
      authorizationEndDateArabic: "",
      contactInfo: "",
      contactInfoArabic: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    const res = await fetch("/api/generate-pdf-tsx", {
      method: "POST",
      body: JSON.stringify(values),
      headers: { "Content-Type": "application/json" },
    });

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "security-clearance.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setLoading(false);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 p-6 max-w-4xl mx-auto"
      >
        {/* Letter Header Upload */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-center">رأس الرسالة</h2>
          <FormField
            control={form.control}
            name="headerImageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>رفع رأس الرسالة (اختياري)</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const result = event.target?.result as string;
                            field.onChange(result);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {field.value && (
                      <div className="flex items-center gap-2">
                        <img 
                          src={field.value} 
                          alt="Header Preview" 
                          className="w-32 h-20 object-contain border border-gray-300 rounded"
                        />
                        <button
                          type="button"
                          onClick={() => field.onChange("")}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          إزالة
                        </button>
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* معلومات أساسية */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-center">معلومات أساسية</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="contractNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>رقم العقد *</FormLabel>
                  <FormControl>
                    <Input placeholder="ادخل رقم العقد" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="idNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>رقم الهوية *</FormLabel>
                  <FormControl>
                    <Input placeholder="ادخل رقم الهوية" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>البريد الإلكتروني *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="ادخل البريد الإلكتروني" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>رقم الهاتف</FormLabel>
                  <FormControl>
                    <Input placeholder="ادخل رقم الهاتف" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* معلومات الشركة */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-center">معلومات الشركة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="companyNameEnglish"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name (English) *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter company name in English" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        <FormField
          control={form.control}
              name="companyNameArabic"
          render={({ field }) => (
            <FormItem>
                  <FormLabel>اسم الشركة *</FormLabel>
              <FormControl>
                <Input placeholder="اكتب اسم الشركة" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
              name="contractSubjectEnglish"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contract Subject (English) *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter contract subject in English" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contractSubjectArabic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>موضوع العقد *</FormLabel>
                  <FormControl>
                    <Input placeholder="اكتب موضوع العقد" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contractedWithEnglish"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contracted with (English) *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter contracted with in English" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contractedWithArabic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>متعاقد مع *</FormLabel>
                  <FormControl>
                    <Input placeholder="اكتب الجهة المتعاقد معها" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* معلومات المدير */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-center">معلومات المدير</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="managerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Manager Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter manager name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter position" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* معلومات التصريح */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-center">معلومات التصريح</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="authorizedPersonName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>FP Name (English) *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter FP name in English" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="authorizedPersonNameArabic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم التصريح *</FormLabel>
                  <FormControl>
                    <Input placeholder="اكتب اسم التصريح" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clearanceTypeEnglish"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Clearance Type (English) *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter clearance type in English" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clearanceTypeArabic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نوع التصريح *</FormLabel>
                  <FormControl>
                    <Input placeholder="اكتب نوع التصريح" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="entryApprovalType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entry Approval Type</FormLabel>
                  <FormControl>
                    <select {...field} className="h-11 md:h-12 w-full min-w-0 rounded-lg border border-gray-300 bg-white px-4 py-2 text-base md:text-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 focus-visible:border-primary disabled:opacity-50 disabled:cursor-not-allowed">
                      <option value="">Select approval type</option>
                      <option value="New">New</option>
                      <option value="Re-new">Re-new</option>
                      <option value="Add">Add</option>
                      <option value="Cancel">Cancel</option>
                      <option value="Other">Other</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>


        {/* أنواع التصاريح */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-center">أنواع التصاريح</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <FormField
              control={form.control}
              name="numberOfIraqis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IQ</FormLabel>
                  <FormControl>
                    <Input placeholder="IQ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="numberOfInternationals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IN</FormLabel>
                  <FormControl>
                    <Input placeholder="IN" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="numberOfVehicles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>VH</FormLabel>
                  <FormControl>
                    <Input placeholder="VH" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="numberOfWeapons"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WP</FormLabel>
                  <FormControl>
                    <Input placeholder="WP" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* التواريخ والفترات */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-center">التواريخ والفترات</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="fromDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>من تاريخ</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="toDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>إلى تاريخ</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startingDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Starting Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contractPeriod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contract Period</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter contract period" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="numberOfDaysEnglish"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Days (English)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter number of days" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="numberOfDaysArabic"
          render={({ field }) => (
            <FormItem>
                  <FormLabel>عدد الأيام (اختياري)</FormLabel>
              <FormControl>
                    <Input placeholder="اكتب عدد الأيام" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
          </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "جاري الإنشاء..." : "إنشاء الملف"}
        </Button>
      </form>
    </Form>
  );
}