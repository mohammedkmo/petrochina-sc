/**
 * Form Steps Configuration
 * 
 * This file contains the step definitions and metadata for the multi-step form.
 * Each step includes its ID, title, description, and icon.
 */

import {
  CheckCircle,
  Building2,
  FileText,
  Users,
  CheckSquare,
  Clock,
  Truck,
  UserCheck,
  User,
  Calendar,
  Image,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

/**
 * Step definition interface
 */
export interface StepDefinition {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
}

/**
 * Creates the step definitions array with translations
 * @param t - Translation function from next-intl
 * @returns Array of step definitions
 */
export const getSteps = (t: (key: string) => string): StepDefinition[] => [
  {
    id: 1,
    title: t("form.steps.clearance.title"),
    description: t("form.steps.clearance.description"),
    icon: CheckSquare,
  },
  {
    id: 2,
    title: t("form.steps.companyIdentity.title"),
    description: t("form.steps.companyIdentity.description"),
    icon: Building2,
  },
  {
    id: 3,
    title: t("form.steps.companyContact.title"),
    description: t("form.steps.companyContact.description"),
    icon: Image,
  },
  {
    id: 4,
    title: t("form.steps.contractPartners.title"),
    description: t("form.steps.contractPartners.description"),
    icon: Users,
  },
  {
    id: 5,
    title: t("form.steps.contractDetails.title"),
    description: t("form.steps.contractDetails.description"),
    icon: FileText,
  },
  {
    id: 6,
    title: t("form.steps.contractTimeline.title"),
    description: t("form.steps.contractTimeline.description"),
    icon: Clock,
  },
  {
    id: 7,
    title: t("form.steps.staffCounts.title"),
    description: t("form.steps.staffCounts.description"),
    icon: Users,
  },
  {
    id: 8,
    title: t("form.steps.resources.title"),
    description: t("form.steps.resources.description"),
    icon: Truck,
  },
  {
    id: 9,
    title: t("form.steps.purpose.title"),
    description: t("form.steps.purpose.description"),
    icon: FileText,
  },
  {
    id: 10,
    title: t("form.steps.management.title"),
    description: t("form.steps.management.description"),
    icon: UserCheck,
  },
  {
    id: 11,
    title: t("form.steps.authorizedPerson.title"),
    description: t("form.steps.authorizedPerson.description"),
    icon: User,
  },
  {
    id: 12,
    title: t("form.steps.authorizationValidity.title"),
    description: t("form.steps.authorizationValidity.description"),
    icon: Calendar,
  },
  {
    id: 13,
    title: t("form.steps.review.title"),
    description: t("form.steps.review.description"),
    icon: CheckCircle,
  },
];

