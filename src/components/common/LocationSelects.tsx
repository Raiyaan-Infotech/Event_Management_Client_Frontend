"use client";

import React, { useState, useEffect } from "react";
import { Flag, Globe, Building, ChevronRight } from "lucide-react";
import { FormGroup } from "@/components/common/FormGroup";
import {
  useCountries,
  useStates,
  useDistricts,
  useCities,
  type LocationItem,
} from "@/hooks/use-locations";

export interface LocationValues {
  country: string;
  state: string;
  district: string;
  city: string;
}

// ─── Single Searchable Select ─────────────────────────────────────────────────
function LocationSelect({
  value,
  onValueChange,
  options,
  placeholder,
  icon: Icon,
  disabled = false,
  isLoading = false,
}: {
  value: string;
  onValueChange: (name: string) => void;
  options: LocationItem[];
  placeholder: string;
  icon: React.ElementType;
  disabled?: boolean;
  isLoading?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = options.filter((o) =>
    o.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative group">
      <div className="relative">
        <Icon
          size={16}
          className={`absolute left-3 top-1/2 -translate-y-1/2 z-10 transition-colors pointer-events-none
            ${disabled ? "text-muted-foreground/30" : "text-muted-foreground/50 group-focus-within:text-primary"}`}
        />
        <input
          value={open ? search : value || ""}
          onChange={(e) => {
            if (disabled) return;
            setSearch(e.target.value);
            if (!open) setOpen(true);
          }}
          onFocus={() => {
            if (disabled) return;
            setOpen(true);
            setSearch("");
          }}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          readOnly={disabled}
          placeholder={isLoading ? "Loading…" : placeholder}
          className={`h-10 w-full pl-9 pr-8 border border-input rounded-sm text-sm bg-background outline-none transition-all
            focus:ring-2 focus:ring-ring focus:ring-offset-0
            ${disabled ? "opacity-50 cursor-default bg-muted/30" : ""}
            ${!disabled && !open && value ? "font-medium" : ""}`}
        />
        <ChevronRight
          size={13}
          className={`absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 transition-transform duration-200 pointer-events-none
            ${open ? "rotate-90" : ""}`}
        />
      </div>

      {open && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-sm shadow-lg max-h-52 overflow-y-auto">
          {/* Clear option */}
          <button
            type="button"
            onMouseDown={() => { onValueChange(""); setOpen(false); }}
            className="w-full text-left px-3 py-2 text-xs text-muted-foreground italic hover:bg-muted border-b border-border/50"
          >
            {placeholder}
          </button>

          {isLoading ? (
            <div className="px-3 py-3 text-xs text-muted-foreground text-center italic">Loading…</div>
          ) : filtered.length > 0 ? (
            filtered.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onMouseDown={() => { onValueChange(opt.name); setOpen(false); }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors
                  ${value === opt.name ? "text-primary font-semibold bg-primary/5" : "text-foreground"}`}
              >
                {opt.name}
              </button>
            ))
          ) : (
            <div className="px-3 py-2 text-xs text-muted-foreground italic">No results found</div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── LocationSelects (Country → State → District → City) ─────────────────────
export function LocationSelects({
  values,
  onChange,
}: {
  values: LocationValues;
  onChange: (values: LocationValues) => void;
}) {
  const [countryId, setCountryId]   = useState<number | null>(null);
  const [stateId,   setStateId]     = useState<number | null>(null);
  const [districtId,setDistrictId]  = useState<number | null>(null);

  const { data: countries  = [], isLoading: loadingCountries  } = useCountries();
  const { data: states     = [], isLoading: loadingStates      } = useStates(countryId);
  const { data: districts  = [], isLoading: loadingDistricts   } = useDistricts(stateId);
  const { data: cities     = [], isLoading: loadingCities      } = useCities(districtId);

  // Resolve IDs from saved names when data loads (for pre-fill on edit)
  useEffect(() => {
    if (!countries.length || !values.country) return;
    const found = countries.find((c) => c.name === values.country);
    setCountryId(found?.id ?? null);
  }, [countries, values.country]);

  useEffect(() => {
    if (!states.length || !values.state) return;
    const found = states.find((s) => s.name === values.state);
    setStateId(found?.id ?? null);
  }, [states, values.state]);

  useEffect(() => {
    if (!districts.length || !values.district) return;
    const found = districts.find((d) => d.name === values.district);
    setDistrictId(found?.id ?? null);
  }, [districts, values.district]);

  // Handlers
  const handleCountry = (name: string) => {
    const found = countries.find((c) => c.name === name);
    setCountryId(found?.id ?? null);
    setStateId(null);
    setDistrictId(null);
    onChange({ country: name, state: "", district: "", city: "" });
  };

  const handleState = (name: string) => {
    const found = states.find((s) => s.name === name);
    setStateId(found?.id ?? null);
    setDistrictId(null);
    onChange({ ...values, state: name, district: "", city: "" });
  };

  const handleDistrict = (name: string) => {
    const found = districts.find((d) => d.name === name);
    setDistrictId(found?.id ?? null);
    onChange({ ...values, district: name, city: "" });
  };

  const handleCity = (name: string) => {
    onChange({ ...values, city: name });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
      <FormGroup label="Country">
        <LocationSelect
          value={values.country}
          onValueChange={handleCountry}
          options={countries}
          placeholder="Select Country"
          icon={Flag}
          isLoading={loadingCountries}
        />
      </FormGroup>

      <FormGroup label="State">
        <LocationSelect
          value={values.state}
          onValueChange={handleState}
          options={states}
          placeholder={values.country ? "Select State" : "Select Country First"}
          icon={Globe}
          disabled={!countryId}
          isLoading={loadingStates}
        />
      </FormGroup>

      <FormGroup label="District">
        <LocationSelect
          value={values.district}
          onValueChange={handleDistrict}
          options={districts}
          placeholder={values.state ? "Select District" : "Select State First"}
          icon={Building}
          disabled={!stateId}
          isLoading={loadingDistricts}
        />
      </FormGroup>

      <FormGroup label="City">
        <LocationSelect
          value={values.city}
          onValueChange={handleCity}
          options={cities}
          placeholder={values.district ? "Select City" : "Select District First"}
          icon={Building}
          disabled={!districtId}
          isLoading={loadingCities}
        />
      </FormGroup>
    </div>
  );
}
