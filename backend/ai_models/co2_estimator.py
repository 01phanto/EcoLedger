"""
CO₂ Absorption Estimator API
Calculates carbon absorption from mangrove tree count
"""

import numpy as np
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class CO2EstimatorAPI:
    def __init__(self):
        """
        Initialize CO₂ estimator with mangrove-specific parameters
        """
        # Mangrove CO₂ absorption rates (kg CO₂ per tree per year)
        self.base_absorption_rate = 12.3  # kg CO₂ per tree per year (as specified)
        
        # Additional factors for more accurate estimation
        self.tree_age_factors = {
            'seedling': 0.3,      # 0-2 years
            'young': 0.6,         # 2-5 years  
            'mature': 1.0,        # 5-15 years
            'old_growth': 0.8     # 15+ years (slower growth)
        }
        
        self.species_factors = {
            'rhizophora': 1.2,    # Higher absorption
            'avicennia': 1.0,     # Baseline
            'laguncularia': 0.9,  # Slightly lower
            'conocarpus': 0.8,    # Lower absorption
            'general': 1.0        # Default for mixed/unknown species
        }
        
        self.environmental_factors = {
            'optimal': 1.2,       # Perfect conditions
            'good': 1.0,          # Normal conditions
            'moderate': 0.8,      # Some stress
            'poor': 0.6           # High stress
        }
    
    def calculate_co2_absorption(self, tree_count, **kwargs):
        """
        Calculate CO₂ absorption based on tree count and optional parameters
        
        Args:
            tree_count: Number of trees detected
            **kwargs: Optional parameters for more accurate estimation
                - tree_age: Average age category
                - species: Mangrove species
                - environmental_condition: Environmental stress level
                - project_duration: Duration in years
                - survival_rate: Expected tree survival rate
        
        Returns:
            dict: CO₂ absorption calculations
        """
        try:
            # Basic calculation
            base_co2_kg = tree_count * self.base_absorption_rate
            
            # Apply adjustment factors if provided
            adjusted_co2_kg = self._apply_adjustment_factors(base_co2_kg, **kwargs)
            
            # Calculate additional metrics
            co2_tonnes = adjusted_co2_kg / 1000
            co2_annual_kg = adjusted_co2_kg  # Already per year
            
            # Project lifetime calculations
            project_duration = kwargs.get('project_duration', 10)  # Default 10 years
            lifetime_co2_kg = adjusted_co2_kg * project_duration
            lifetime_co2_tonnes = lifetime_co2_kg / 1000
            
            # Calculate carbon equivalent (C content is ~27% of CO₂)
            carbon_kg = adjusted_co2_kg * 0.2727
            carbon_tonnes = carbon_kg / 1000
            
            # Economic value estimation (rough estimate)
            carbon_price_per_tonne = kwargs.get('carbon_price', 15)  # USD per tonne CO₂
            economic_value_annual = co2_tonnes * carbon_price_per_tonne
            economic_value_lifetime = lifetime_co2_tonnes * carbon_price_per_tonne
            
            # Environmental impact metrics
            equivalent_metrics = self._calculate_equivalents(adjusted_co2_kg)
            
            return {
                "Tree_Count": tree_count,
                "CO2_absorbed_kg": round(adjusted_co2_kg, 2),
                "CO2_absorbed_tonnes": round(co2_tonnes, 3),
                "CO2_annual_kg": round(co2_annual_kg, 2),
                "Carbon_kg": round(carbon_kg, 2),
                "Carbon_tonnes": round(carbon_tonnes, 3),
                "Project_Duration_years": project_duration,
                "Lifetime_CO2_kg": round(lifetime_co2_kg, 2),
                "Lifetime_CO2_tonnes": round(lifetime_co2_tonnes, 2),
                "Economic_Value_USD_annual": round(economic_value_annual, 2),
                "Economic_Value_USD_lifetime": round(economic_value_lifetime, 2),
                "Equivalent_Metrics": equivalent_metrics,
                "Calculation_Details": self._get_calculation_details(**kwargs),
                "status": "success"
            }
            
        except Exception as e:
            logger.error(f"CO₂ calculation failed: {e}")
            return {
                "error": f"CO₂ calculation failed: {str(e)}",
                "Tree_Count": tree_count,
                "CO2_absorbed_kg": 0.0
            }
    
    def _apply_adjustment_factors(self, base_co2_kg, **kwargs):
        """Apply various adjustment factors to base CO₂ calculation"""
        adjusted_co2 = base_co2_kg
        
        # Tree age factor
        tree_age = kwargs.get('tree_age', 'mature')
        if tree_age in self.tree_age_factors:
            adjusted_co2 *= self.tree_age_factors[tree_age]
        
        # Species factor
        species = kwargs.get('species', 'general')
        if species in self.species_factors:
            adjusted_co2 *= self.species_factors[species]
        
        # Environmental condition factor
        env_condition = kwargs.get('environmental_condition', 'good')
        if env_condition in self.environmental_factors:
            adjusted_co2 *= self.environmental_factors[env_condition]
        
        # Survival rate (for new plantations)
        survival_rate = kwargs.get('survival_rate', 1.0)
        if 0 <= survival_rate <= 1:
            adjusted_co2 *= survival_rate
        
        # Density factor (trees per hectare affects individual growth)
        density = kwargs.get('trees_per_hectare', None)
        if density:
            if density > 2000:  # Very high density
                adjusted_co2 *= 0.8
            elif density < 500:  # Very low density
                adjusted_co2 *= 1.1
        
        return adjusted_co2
    
    def _calculate_equivalents(self, co2_kg):
        """Calculate equivalent environmental impact metrics"""
        try:
            # Common CO₂ equivalents
            car_miles = co2_kg / 0.404  # kg CO₂ per mile for average car
            homes_powered_days = co2_kg / 26.4  # kg CO₂ per day for average home
            trees_planted_equivalent = co2_kg / 22  # kg CO₂ absorbed by average tree
            
            return {
                "Car_miles_offset": round(car_miles, 1),
                "Home_power_days": round(homes_powered_days, 1),
                "Tree_planting_equivalent": round(trees_planted_equivalent, 1),
                "Gasoline_liters_offset": round(co2_kg / 2.31, 1),  # kg CO₂ per liter gasoline
                "Coal_kg_offset": round(co2_kg / 2.86, 1)  # kg CO₂ per kg coal
            }
        except Exception as e:
            logger.error(f"Equivalents calculation failed: {e}")
            return {}
    
    def _get_calculation_details(self, **kwargs):
        """Get details about the calculation factors used"""
        details = {
            "base_rate_kg_per_tree": self.base_absorption_rate,
            "factors_applied": {}
        }
        
        if 'tree_age' in kwargs:
            age = kwargs['tree_age']
            details["factors_applied"]["tree_age"] = {
                "category": age,
                "factor": self.tree_age_factors.get(age, 1.0)
            }
        
        if 'species' in kwargs:
            species = kwargs['species']
            details["factors_applied"]["species"] = {
                "type": species,
                "factor": self.species_factors.get(species, 1.0)
            }
        
        if 'environmental_condition' in kwargs:
            env = kwargs['environmental_condition']
            details["factors_applied"]["environmental"] = {
                "condition": env,
                "factor": self.environmental_factors.get(env, 1.0)
            }
        
        if 'survival_rate' in kwargs:
            details["factors_applied"]["survival_rate"] = kwargs['survival_rate']
        
        return details
    
    def estimate_plantation_potential(self, area_hectares, tree_density=1000):
        """
        Estimate CO₂ absorption potential for a plantation area
        
        Args:
            area_hectares: Area in hectares
            tree_density: Trees per hectare (default 1000)
        
        Returns:
            dict: Potential CO₂ absorption estimates
        """
        try:
            total_trees = area_hectares * tree_density
            
            # Calculate for different scenarios
            scenarios = {
                'conservative': {
                    'survival_rate': 0.7,
                    'environmental_condition': 'moderate',
                    'tree_age': 'young'
                },
                'realistic': {
                    'survival_rate': 0.8,
                    'environmental_condition': 'good',
                    'tree_age': 'mature'
                },
                'optimal': {
                    'survival_rate': 0.9,
                    'environmental_condition': 'optimal',
                    'tree_age': 'mature'
                }
            }
            
            results = {}
            for scenario_name, params in scenarios.items():
                result = self.calculate_co2_absorption(
                    total_trees,
                    project_duration=20,
                    **params
                )
                results[scenario_name] = {
                    'annual_co2_tonnes': result['CO2_absorbed_tonnes'],
                    'lifetime_co2_tonnes': result['Lifetime_CO2_tonnes'],
                    'economic_value_lifetime': result['Economic_Value_USD_lifetime']
                }
            
            return {
                "area_hectares": area_hectares,
                "tree_density": tree_density,
                "total_trees": total_trees,
                "scenarios": results,
                "status": "success"
            }
            
        except Exception as e:
            logger.error(f"Plantation potential estimation failed: {e}")
            return {
                "error": f"Estimation failed: {str(e)}",
                "area_hectares": area_hectares
            }
    
    def calculate_carbon_credits(self, co2_absorbed_kg, verification_score=1.0):
        """
        Calculate carbon credits based on CO₂ absorption and verification score
        
        Args:
            co2_absorbed_kg: CO₂ absorbed in kg
            verification_score: Verification confidence (0-1)
        
        Returns:
            dict: Carbon credit calculations
        """
        try:
            # Convert to tonnes (carbon credits are typically in tonnes CO₂)
            co2_tonnes = co2_absorbed_kg / 1000
            
            # Apply verification score
            verified_co2_tonnes = co2_tonnes * verification_score
            
            # Carbon credits (1 credit = 1 tonne CO₂)
            carbon_credits = verified_co2_tonnes
            
            # Buffer allocation (typically 10-20% held in buffer pool)
            buffer_rate = 0.15  # 15% buffer
            buffer_credits = carbon_credits * buffer_rate
            available_credits = carbon_credits * (1 - buffer_rate)
            
            # Market value estimation
            credit_price_range = {
                'voluntary_market_low': 5,   # USD per credit
                'voluntary_market_avg': 15,
                'voluntary_market_high': 30,
                'compliance_market_avg': 25
            }
            
            market_values = {}
            for market, price in credit_price_range.items():
                market_values[market] = round(available_credits * price, 2)
            
            return {
                "CO2_tonnes": round(co2_tonnes, 3),
                "Verification_Score": verification_score,
                "Verified_CO2_tonnes": round(verified_co2_tonnes, 3),
                "Total_Carbon_Credits": round(carbon_credits, 3),
                "Buffer_Credits": round(buffer_credits, 3),
                "Available_Credits": round(available_credits, 3),
                "Buffer_Rate": buffer_rate,
                "Market_Value_USD": market_values,
                "status": "success"
            }
            
        except Exception as e:
            logger.error(f"Carbon credits calculation failed: {e}")
            return {
                "error": f"Carbon credits calculation failed: {str(e)}",
                "Available_Credits": 0.0
            }