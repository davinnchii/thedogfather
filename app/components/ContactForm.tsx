"use client";

import { useState, useRef, useEffect } from "react";
import { Input, Textarea } from "./Input";

interface FormData {
  // Contact Information
  name: string;
  phone: string;
  email: string;
  address: string;
  
  // Dog Information
  dogName: string;
  breed: string;
  age: string;
  weight: string;
  gender: string;
  
  // Health and Safety
  hasInsurance: string; // "yes" | "no"
  isVaccinated: string; // "yes" | "no"
  insuranceProvider: string;
  chipped: string; // "yes" | "no"
  nameTagWithPhone: string; // "yes" | "no"
  allergies: string;
  reactions: string;
  
  // Dog Behavior
  behaviorWithDogs: string;
  behaviorOnWalks: string;
  needsExtraDistance: string;
  crateRoutine: string;
  
  // Service Request
  serviceType: string[]; // Array of selected services
  startDate: string;
  endDate: string;

  // Terms
  termsAccepted: boolean;
  
  // Honeypot
  companyName: string;
}

interface FormErrors {
  [key: string]: string | undefined;
}

interface ContactFormProps {
  id?: string;
  title?: string;
  subtitle?: string;
  preselectedServices?: string[];
}

const SERVICE_TYPES = [
  { id: "hundelufting", label: "Hundelufting" },
  { id: "dagpass", label: "Dagpass" },
  { id: "dognpass", label: "Døgnpass" },
  { id: "hundetrening", label: "Privat hundetrening" },
  { id: "valpekurs", label: "Valpekurs" },
  { id: "grunnkurs", label: "Grunnkurs" },
] as const;

function formatServiceTypes(ids: string[]): string {
  return ids
    .map((id) => SERVICE_TYPES.find((s) => s.id === id)?.label ?? id)
    .join(", ");
}

export default function ContactForm({
  id = "contact",
  title = "Forespørsel",
  subtitle = "Fortell litt om hunden din, så tar jeg kontakt innen 24 timer. Informasjonen du gir hjelper meg å planlegge en trygg og god opplevelse – enten det gjelder hundelufting, dagpass, døgnpass eller privat hundetrening.",
  preselectedServices = [],
}: ContactFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    address: "",
    dogName: "",
    breed: "",
    age: "",
    weight: "",
    gender: "",
    hasInsurance: "",
    isVaccinated: "",
    insuranceProvider: "",
    chipped: "",
    nameTagWithPhone: "",
    allergies: "",
    reactions: "",
    behaviorWithDogs: "",
    behaviorOnWalks: "",
    needsExtraDistance: "",
    crateRoutine: "",
    serviceType: [],
    startDate: "",
    endDate: "",
    termsAccepted: false,
    companyName: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>("");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (preselectedServices.length === 0) return;
    setFormData((prev) => ({
      ...prev,
      serviceType: [...new Set([...prev.serviceType, ...preselectedServices])],
    }));
  }, [preselectedServices]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (type === "checkbox") {
      if (name === "termsAccepted") {
        setFormData((prev) => ({
          ...prev,
          [name]: checked,
        }));
      } else if (name.startsWith("serviceType_")) {
        const service = name.replace("serviceType_", "");
        setFormData((prev) => ({
          ...prev,
          serviceType: checked
            ? [...prev.serviceType, service]
            : prev.serviceType.filter((s) => s !== service),
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        ...(name === "hasInsurance" && value !== "yes"
          ? { insuranceProvider: "" }
          : {}),
      }));

      if (name === "hasInsurance" && value !== "yes" && errors.insuranceProvider) {
        setErrors((prev) => ({
          ...prev,
          insuranceProvider: undefined,
        }));
      }
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {};

    // Contact Information
    if (!formData.name.trim()) {
      newErrors.name = "Navn er påkrevd";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Navn må være minst 2 tegn";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Telefon er påkrevd";
    } else if (formData.phone.trim().length < 8) {
      newErrors.phone = "Telefonnummer må være minst 8 siffer";
    }

    if (!formData.email.trim()) {
      newErrors.email = "E-post er påkrevd";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Ugyldig e-postadresse";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Adresse er påkrevd";
    }

    // Dog Information
    if (!formData.dogName.trim()) {
      newErrors.dogName = "Hundens navn er påkrevd";
    }

    if (!formData.breed.trim()) {
      newErrors.breed = "Rase er påkrevd";
    }

    if (!formData.age.trim()) {
      newErrors.age = "Alder er påkrevd";
    }

    if (!formData.weight.trim()) {
      newErrors.weight = "Vekt er påkrevd";
    }

    if (!formData.gender) {
      newErrors.gender = "Kjønn er påkrevd";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: FormErrors = {};

    // Health and Safety
    if (!formData.hasInsurance) {
      newErrors.hasInsurance = "Dette feltet er påkrevd";
    }
    if (!formData.isVaccinated) {
      newErrors.isVaccinated = "Dette feltet er påkrevd";
    }
    if (
      formData.hasInsurance === "yes" &&
      !formData.insuranceProvider.trim()
    ) {
      newErrors.insuranceProvider = "Dette feltet er påkrevd";
    }
    if (!formData.chipped) {
      newErrors.chipped = "Dette feltet er påkrevd";
    }
    if (!formData.nameTagWithPhone) {
      newErrors.nameTagWithPhone = "Dette feltet er påkrevd";
    }
    if (!formData.allergies.trim()) {
      newErrors.allergies = "Dette feltet er påkrevd";
    }
    if (!formData.reactions.trim()) {
      newErrors.reactions = "Dette feltet er påkrevd";
    }

    // Dog Behavior
    if (!formData.behaviorWithDogs.trim()) {
      newErrors.behaviorWithDogs = "Dette feltet er påkrevd";
    }
    if (!formData.behaviorOnWalks.trim()) {
      newErrors.behaviorOnWalks = "Dette feltet er påkrevd";
    }
    if (!formData.needsExtraDistance.trim()) {
      newErrors.needsExtraDistance = "Dette feltet er påkrevd";
    }
    if (!formData.crateRoutine.trim()) {
      newErrors.crateRoutine = "Dette feltet er påkrevd";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const newErrors: FormErrors = {};

    if (formData.serviceType.length === 0) {
      newErrors.serviceType = "Velg minst én tjeneste";
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!formData.startDate.trim()) {
      newErrors.startDate = "Start dato er påkrevd";
    } else {
      const start = new Date(formData.startDate);
      start.setHours(0, 0, 0, 0);
      if (start < today) {
        newErrors.startDate = "Velg en dato i dag eller senere";
      }
    }

    if (!formData.endDate.trim()) {
      newErrors.endDate = "Slutt dato er påkrevd";
    } else {
      const end = new Date(formData.endDate);
      end.setHours(0, 0, 0, 0);
      if (end < today) {
        newErrors.endDate = "Velg en dato i dag eller senere";
      } else if (formData.startDate.trim()) {
        const start = new Date(formData.startDate);
        start.setHours(0, 0, 0, 0);
        if (end < start) {
          newErrors.endDate = "Slutt dato må være etter start dato";
        }
      }
    }

    if (!formData.termsAccepted) {
      newErrors.termsAccepted = "Du må akseptere vilkårene for å sende inn";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const buildRequestBody = () => ({
    name: formData.name.trim(),
    email: formData.email.trim(),
    phone: formData.phone.trim(),
    message: `Forespørsel om ${formatServiceTypes(formData.serviceType)}`,
    questions: {
      "Adresse": formData.address.trim(),
      "Hundens navn": formData.dogName.trim(),
      "Rase": formData.breed.trim(),
      "Alder": formData.age.trim(),
      "Vekt": formData.weight.trim(),
      "Kjønn": formData.gender,
      "Er hunden forsikret": formData.hasInsurance,
      "Er hunden vaksinert": formData.isVaccinated,
      "Hvor er hunden forsikret":
        formData.hasInsurance === "yes"
          ? formData.insuranceProvider.trim()
          : "Ikke oppgitt",
      "Er hunden chippet": formData.chipped,
      "Har hunden navnebrikke med telefonnummer": formData.nameTagWithPhone,
      "Allergier eller helseutfordringer": formData.allergies.trim(),
      "Reaksjoner rundt matskål, leker, etc.": formData.reactions.trim(),
      "Fungerer med andre hunder": formData.behaviorWithDogs.trim(),
      "I møte med andre hunder på tur": formData.behaviorOnWalks.trim(),
      "Trenger ekstra avstand": formData.needsExtraDistance.trim(),
      "Vant til bur i hverdagen": formData.crateRoutine.trim(),
      "Tjenestetype": formatServiceTypes(formData.serviceType),
      "Ønsket periode": (() => {
        const fmt = (iso: string) => {
          const raw = iso.trim();
          const m = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
          return m ? `${m[3]}.${m[2]}.${m[1]}` : raw;
        };
        const s = formData.startDate.trim();
        const e = formData.endDate.trim();
        if (!s && !e) return "";
        if (!e) return fmt(s);
        if (!s) return fmt(e);
        return `${fmt(s)} – ${fmt(e)}`;
      })(),
    },
    companyName: formData.companyName || "",
  });

  const submitToApi = async (requestBody: ReturnType<typeof buildRequestBody>) => {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });
    const data = await response.json();
    return { ok: response.ok, status: response.status, data };
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const { ok, status, data } = await submitToApi(buildRequestBody());

      if (!ok) {
        if (status === 429) setSubmitError("For mange forespørsler. Prøv igjen senere.");
        else if (data?.error) setSubmitError(data.error);
        else setSubmitError("En feil oppstod. Vennligst prøv igjen.");
        setIsSubmitting(false);
        return;
      }

      setFormData({
        name: "", phone: "", email: "", address: "", dogName: "", breed: "", age: "", weight: "", gender: "",
        hasInsurance: "", isVaccinated: "", insuranceProvider: "", chipped: "", nameTagWithPhone: "",
        allergies: "", reactions: "", behaviorWithDogs: "",
        behaviorOnWalks: "", needsExtraDistance: "", crateRoutine: "", serviceType: [], startDate: "", endDate: "",
        termsAccepted: false, companyName: "",
      });
      setCurrentStep(4);
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitError("Nettverksfeil. Vennligst sjekk tilkoblingen og prøv igjen.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id={id} className="py-20 px-4 bg-surface-secondary">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-on-surface mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-on-surface-secondary max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Progress Indicator - hide on success step */}
        {currentStep !== 4 && (
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 md:gap-4">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all ${
                currentStep >= 1
                  ? "bg-primary text-on-surface"
                  : "bg-neutral-200 text-on-surface-secondary"
              }`}
            >
              1
            </div>
            <div
              className={`h-1 w-16 md:w-24 transition-all ${
                currentStep >= 2 ? "bg-primary" : "bg-neutral-200"
              }`}
            />
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all ${
                currentStep >= 2
                  ? "bg-primary text-on-surface"
                  : "bg-neutral-200 text-on-surface-secondary"
              }`}
            >
              2
            </div>
            <div
              className={`h-1 w-16 md:w-24 transition-all ${
                currentStep >= 3 ? "bg-primary" : "bg-neutral-200"
              }`}
            />
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all ${
                currentStep >= 3
                  ? "bg-primary text-on-surface"
                  : "bg-neutral-200 text-on-surface-secondary"
              }`}
            >
              3
            </div>
          </div>
        </div>
        )}

        {/* Form or Success */}
        {currentStep === 4 ? (
          <div className="bg-surface rounded-xl shadow-lg p-8 md:p-12 border border-divider text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
              <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-on-surface mb-3">
              Takk for din forespørsel
            </h3>
            <p className="text-on-surface-secondary text-lg mb-8 max-w-md mx-auto">
              Din forespørsel er sendt. Jeg tar kontakt innen 24 timer. Sjekk også e-posten din for en bekreftelse.
            </p>
            <button
              type="button"
              onClick={() => { setCurrentStep(1); formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
              className="px-8 py-4 bg-surface-dark hover:bg-muted text-primary rounded-full text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Send ny forespørsel
            </button>
          </div>
        ) : (
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          noValidate
          className="bg-surface rounded-xl shadow-lg p-8 md:p-10 border border-divider"
        >
          {currentStep === 1 && (
            <div className="space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-2xl font-semibold text-on-surface mb-4">
                  Kontaktinformasjon
                </h3>
                <div className="space-y-4">
                  <Input
                    label="Navn"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    error={errors.name}
                    placeholder="Ditt fulle navn"
                  />

                  <Input
                    label="Telefon"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    error={errors.phone}
                    placeholder="Telefonnummer"
                  />

                  <Input
                    label="E-post"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    error={errors.email}
                    placeholder="Din e-postadresse"
                  />

                  <Input
                    label="Adresse"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    error={errors.address}
                    placeholder="Gateadresse, postnummer og sted"
                  />
                </div>
              </div>

              {/* Dog Information */}
              <div>
                <h3 className="text-2xl font-semibold text-on-surface mb-4">
                  Informasjon om hunden
                </h3>
                <div className="space-y-4">
                  <Input
                    label="Hundens navn"
                    name="dogName"
                    type="text"
                    value={formData.dogName}
                    onChange={handleChange}
                    required
                    error={errors.dogName}
                    placeholder="Hundens navn"
                  />

                  <Input
                    label="Rase"
                    name="breed"
                    type="text"
                    value={formData.breed}
                    onChange={handleChange}
                    required
                    error={errors.breed}
                    placeholder="F.eks. Golden Retriever"
                  />

                  <Input
                    label="Alder"
                    name="age"
                    type="text"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    error={errors.age}
                    placeholder="F.eks. 2 år"
                  />

                  <Input
                    label="Hundens vekt"
                    name="weight"
                    type="text"
                    value={formData.weight}
                    onChange={handleChange}
                    required
                    error={errors.weight}
                    placeholder="F.eks. 12 kg"
                  />

                  <div>
                    <label className="block text-sm font-medium text-on-surface mb-2">
                      Kjønn
                      <span className="text-primary ml-1">*</span>
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-surface border-2 rounded-lg text-on-surface transition-all duration-200 focus:outline-none focus:ring-2 ${
                        errors.gender
                          ? "border-red-500 focus:border-red-600 focus:ring-red-500/20"
                          : "border-primary focus:ring-primary/20"
                      }`}
                    >
                      <option value="">Velg kjønn</option>
                      <option value="hann">Hann</option>
                      <option value="hunn">Hunn</option>
                    </select>
                    {errors.gender && (
                      <p className="mt-2 text-sm text-red-600">{errors.gender}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Next Button */}
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full px-8 py-4 bg-surface-dark hover:bg-muted text-primary rounded-full text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Neste
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              {/* Health and Safety */}
              <div>
                <h3 className="text-2xl font-semibold text-on-surface mb-4">
                  Helse og trygghet
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-on-surface mb-2">
                      Er hunden forsikret?
                      <span className="text-primary ml-1">*</span>
                    </label>
                    <p className="text-sm text-on-surface-secondary mb-3">
                      Gyldig forsikring er en forutsetning for at hunden kan tas imot.
                      Dokumentasjon på forsikring må fremvises før oppstart.
                    </p>
                    <div className="flex gap-4">
                      <label className="flex items-center text-on-surface-secondary">
                        <input
                          type="radio"
                          name="hasInsurance"
                          value="yes"
                          checked={formData.hasInsurance === "yes"}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        Ja
                      </label>
                      <label className="flex items-center text-on-surface-secondary">
                        <input
                          type="radio"
                          name="hasInsurance"
                          value="no"
                          checked={formData.hasInsurance === "no"}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        Nei
                      </label>
                    </div>
                    {errors.hasInsurance && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.hasInsurance}
                      </p>
                    )}
                  </div>

                  <Input
                    label="Hvor er hunden forsikret?"
                    name="insuranceProvider"
                    value={formData.insuranceProvider}
                    onChange={handleChange}
                    required={formData.hasInsurance === "yes"}
                    disabled={formData.hasInsurance !== "yes"}
                    error={errors.insuranceProvider}
                    placeholder="F.eks. If, Agria, Tryg"
                  />

                  <div>
                    <label className="block text-sm font-medium text-on-surface mb-2">
                      Er hunden vaksinert?
                      <span className="text-primary ml-1">*</span>
                    </label>
                    <p className="text-sm text-on-surface-secondary mb-3">
                      Hunden må være vaksinert, og vaksinasjonsbok må fremvises.
                    </p>
                    <div className="flex gap-4">
                      <label className="flex items-center text-on-surface-secondary">
                        <input
                          type="radio"
                          name="isVaccinated"
                          value="yes"
                          checked={formData.isVaccinated === "yes"}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        Ja
                      </label>
                      <label className="flex items-center text-on-surface-secondary">
                        <input
                          type="radio"
                          name="isVaccinated"
                          value="no"
                          checked={formData.isVaccinated === "no"}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        Nei
                      </label>
                    </div>
                    {errors.isVaccinated && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.isVaccinated}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-on-surface mb-2">
                      Er hunden chippet?
                      <span className="text-primary ml-1">*</span>
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center text-on-surface-secondary">
                        <input
                          type="radio"
                          name="chipped"
                          value="yes"
                          checked={formData.chipped === "yes"}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        Ja
                      </label>
                      <label className="flex items-center text-on-surface-secondary">
                        <input
                          type="radio"
                          name="chipped"
                          value="no"
                          checked={formData.chipped === "no"}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        Nei
                      </label>
                    </div>
                    {errors.chipped && (
                      <p className="mt-2 text-sm text-red-600">{errors.chipped}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-on-surface mb-2">
                      Har hunden navnebrikke med telefonnummer?
                      <span className="text-primary ml-1">*</span>
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center text-on-surface-secondary">
                        <input
                          type="radio"
                          name="nameTagWithPhone"
                          value="yes"
                          checked={formData.nameTagWithPhone === "yes"}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        Ja
                      </label>
                      <label className="flex items-center text-on-surface-secondary">
                        <input
                          type="radio"
                          name="nameTagWithPhone"
                          value="no"
                          checked={formData.nameTagWithPhone === "no"}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        Nei
                      </label>
                    </div>
                    {errors.nameTagWithPhone && (
                      <p className="mt-2 text-sm text-red-600">{errors.nameTagWithPhone}</p>
                    )}
                  </div>

                  <Textarea
                    label="Har hunden allergier eller helseutfordringer jeg bør ta hensyn til?"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    rows={3}
                    required
                    error={errors.allergies}
                    placeholder="Beskriv eventuelle allergier eller helseutfordringer"
                  />

                  <Textarea
                    label="Kan hunden reagere rundt matskål, leker, tyggebein eller liggeplass?"
                    name="reactions"
                    value={formData.reactions}
                    onChange={handleChange}
                    rows={3}
                    required
                    error={errors.reactions}
                    placeholder="Beskriv eventuelle reaksjoner"
                  />
                </div>
              </div>

              {/* Dog Behavior */}
              <div>
                <h3 className="text-2xl font-semibold text-on-surface mb-4">
                  Hundens atferd
                </h3>
                <div className="space-y-4">
                  <Textarea
                    label="Hvordan fungerer hunden med andre hunder?"
                    name="behaviorWithDogs"
                    value={formData.behaviorWithDogs}
                    onChange={handleChange}
                    rows={3}
                    required
                    error={errors.behaviorWithDogs}
                    placeholder="Beskriv hvordan hunden fungerer med andre hunder"
                  />

                  <Textarea
                    label="Hvordan er den i møte med andre hunder på tur?"
                    name="behaviorOnWalks"
                    value={formData.behaviorOnWalks}
                    onChange={handleChange}
                    rows={3}
                    required
                    error={errors.behaviorOnWalks}
                    placeholder="Beskriv oppførselen på tur"
                  />

                  <Textarea
                    label="Er det situasjoner der hunden trenger litt ekstra avstand?"
                    name="needsExtraDistance"
                    value={formData.needsExtraDistance}
                    onChange={handleChange}
                    rows={3}
                    required
                    error={errors.needsExtraDistance}
                    placeholder="Beskriv eventuelle situasjoner"
                  />

                  <Textarea
                    label="Er hunden vant til bur i hverdagen, eksempelvis ved transport, hvile eller nattsøvn? Hvordan fungerer dette for hunden?"
                    name="crateRoutine"
                    value={formData.crateRoutine}
                    onChange={handleChange}
                    rows={3}
                    required
                    error={errors.crateRoutine}
                    placeholder="Beskriv hvordan hunden er vant til bur"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 px-8 py-4 bg-neutral-200 hover:bg-neutral-300 text-on-surface rounded-full text-lg font-semibold transition-all duration-300"
                >
                  Tilbake
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 px-8 py-4 bg-surface-dark hover:bg-muted text-primary rounded-full text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Neste
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              {/* Service Type */}
              <div>
                <h3 className="text-2xl font-semibold text-on-surface mb-4">
                  Tjenestetype
                </h3>
                <div className="space-y-3">
                  {SERVICE_TYPES.map((service) => (
                    <label
                      key={service.id}
                      className="flex items-center p-4 border-2 border-divider rounded-lg hover:border-primary transition-all cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        name={`serviceType_${service.id}`}
                        checked={formData.serviceType.includes(service.id)}
                        onChange={handleChange}
                        className="mr-3 w-5 h-5 text-primary focus:ring-primary rounded"
                      />
                      <span className="text-on-surface font-medium">
                        {service.label}
                      </span>
                    </label>
                  ))}
                  {errors.serviceType && (
                    <p className="mt-2 text-sm text-red-600">{errors.serviceType}</p>
                  )}
                </div>
              </div>

              {/* Desired period – start and end date */}
              <div className="space-y-4">
                <p className="block text-sm font-medium text-on-surface mb-2">
                  Ønsket periode
                  <span className="text-primary ml-1" aria-label="påkrevd">*</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="startDate" className="block text-sm text-on-surface-secondary mb-1">
                      Start dato
                    </label>
                    <input
                      id="startDate"
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      onBlur={() => {
                        if (formData.startDate.trim()) {
                          const start = new Date(formData.startDate);
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          start.setHours(0, 0, 0, 0);
                          if (start < today) {
                            setErrors((prev) => ({ ...prev, startDate: "Velg en dato i dag eller senere" }));
                          } else {
                            setErrors((prev) => ({ ...prev, startDate: undefined }));
                            if (formData.endDate.trim()) {
                              const end = new Date(formData.endDate);
                              end.setHours(0, 0, 0, 0);
                              setErrors((prev) => ({
                                ...prev,
                                endDate: end < start ? "Slutt dato må være etter start dato" : undefined,
                              }));
                            }
                          }
                        } else {
                          setErrors((prev) => ({ ...prev, startDate: "Start dato er påkrevd" }));
                        }
                      }}
                      min={new Date().toISOString().slice(0, 10)}
                      className={`w-full px-4 py-3 bg-surface border-2 rounded-lg text-on-surface transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                        errors.startDate
                          ? "border-red-500 focus:border-red-600 focus:ring-red-500/20"
                          : "border-divider focus:border-primary"
                      }`}
                      aria-invalid={!!errors.startDate}
                      aria-describedby={errors.startDate ? "startDate-error" : undefined}
                    />
                    {errors.startDate && (
                      <p id="startDate-error" className="mt-2 text-sm text-red-600" role="alert">{errors.startDate}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="endDate" className="block text-sm text-on-surface-secondary mb-1">
                      Slutt dato
                    </label>
                    <input
                      id="endDate"
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      onBlur={() => {
                        if (formData.endDate.trim()) {
                          const end = new Date(formData.endDate);
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          end.setHours(0, 0, 0, 0);
                          if (end < today) {
                            setErrors((prev) => ({ ...prev, endDate: "Velg en dato i dag eller senere" }));
                          } else if (formData.startDate.trim()) {
                            const start = new Date(formData.startDate);
                            start.setHours(0, 0, 0, 0);
                            setErrors((prev) => ({
                              ...prev,
                              endDate: end < start ? "Slutt dato må være etter start dato" : undefined,
                            }));
                          } else {
                            setErrors((prev) => ({ ...prev, endDate: undefined }));
                          }
                        } else {
                          setErrors((prev) => ({ ...prev, endDate: "Slutt dato er påkrevd" }));
                        }
                      }}
                      min={formData.startDate || new Date().toISOString().slice(0, 10)}
                      className={`w-full px-4 py-3 bg-surface border-2 rounded-lg text-on-surface transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                        errors.endDate
                          ? "border-red-500 focus:border-red-600 focus:ring-red-500/20"
                          : "border-divider focus:border-primary"
                      }`}
                      aria-invalid={!!errors.endDate}
                      aria-describedby={errors.endDate ? "endDate-error" : undefined}
                    />
                    {errors.endDate && (
                      <p id="endDate-error" className="mt-2 text-sm text-red-600" role="alert">{errors.endDate}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Terms Confirmation */}
              <div>
                <label className="flex items-start p-4 border-2 border-divider rounded-lg hover:border-primary transition-all cursor-pointer">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                    className="mt-1 mr-3 w-5 h-5 text-primary focus:ring-primary rounded"
                  />
                  <span className="text-on-surface">
                    Jeg bekrefter at jeg har lest og akseptert vilkårene.
                    <span className="text-primary ml-1">*</span>
                    <span className="block text-sm text-on-surface-secondary mt-1">
                      (Vilkårene må aksepteres før innsending.)
                    </span>
                  </span>
                </label>
                {errors.termsAccepted && (
                  <p className="mt-2 text-sm text-red-600">{errors.termsAccepted}</p>
                )}
              </div>

              {/* Honeypot field - hidden from users */}
              <div className="hidden" aria-hidden="true">
                <Input
                  label="Firmanavn"
                  name="companyName"
                  type="text"
                  value={formData.companyName}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {/* Error Message */}
              {submitError && (
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                  <p className="text-red-800 font-medium">{submitError}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleBack}
                  className="order-last sm:order-first flex-1 px-8 py-4 bg-neutral-200 hover:bg-neutral-300 text-on-surface rounded-full text-lg font-semibold transition-all duration-300"
                >
                  Tilbake
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-8 py-4 bg-surface-dark hover:bg-muted text-primary rounded-full text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-surface-dark"
                >
                  {isSubmitting ? "Sender..." : "Send forespørsel"}
                </button>
              </div>
            </div>
          )}
        </form>
        )}
      </div>
    </section>
  );
}
