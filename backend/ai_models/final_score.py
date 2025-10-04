"""
Final Score & Carbon Credits Calculator API
Combines all AI metrics to calculate final verification score and carbon credits
"""

import numpy as np
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class FinalScoreAPI:
    def __init__(self):
        """
        Initialize final score calculator with specified weights
        Final_Score = 0.4×AI_Tree_Score + 0.3×NDVI_Score + 0.2×IoT_Score + 0.1×Audit_Check
        """
        self.weights = {
            'ai_tree_score': 0.4,    # Tree detection accuracy
            'ndvi_score': 0.3,       # Vegetation health
            'iot_score': 0.2,        # Environmental conditions
            'audit_check': 0.1       # Human audit verification
        }
        
        # CO₂ absorption rate (as specified)
        self.co2_per_tree = 12.3  # kg CO₂ per tree per year
        
        # Score thresholds for credit quality
        self.quality_thresholds = {
            'premium': 0.9,     # High-quality credits
            'standard': 0.75,   # Standard credits
            'basic': 0.6,       # Basic credits
            'insufficient': 0.5 # Below threshold for credits
        }
    
    def calculate_final_score(self, data):
        """
        Calculate final verification score and carbon credits
        
        Args:
            data: Dictionary containing:
                - tree_count: Detected tree count
                - claimed_trees: NGO claimed tree count
                - ndvi_score: NDVI vegetation health score (0-1)
                - iot_score: IoT sensor score (0-1)
                - audit_check: Human audit score (0-1, optional, default 0.8)
                
        Returns:
            dict: Final score calculation results
        """
        try:
            # Extract input parameters
            tree_count = int(data.get('tree_count', 0))
            claimed_trees = int(data.get('claimed_trees', 1))  # Avoid division by zero
            ndvi_score = float(data.get('ndvi_score', 0))
            iot_score = float(data.get('iot_score', 0))
            audit_check = float(data.get('audit_check', 0.8))  # Default moderate audit score
            
            # Validate inputs
            self._validate_inputs(tree_count, claimed_trees, ndvi_score, iot_score, audit_check)
            
            # Calculate AI Tree Score
            ai_tree_score = self._calculate_ai_tree_score(tree_count, claimed_trees)
            
            # Calculate Final Score using specified formula
            final_score = (
                self.weights['ai_tree_score'] * ai_tree_score +
                self.weights['ndvi_score'] * ndvi_score +
                self.weights['iot_score'] * iot_score +
                self.weights['audit_check'] * audit_check
            )
            
            # Ensure final score is between 0 and 1
            final_score = max(0, min(1, final_score))
            
            # Calculate CO₂ absorption
            co2_absorbed_kg = tree_count * self.co2_per_tree
            
            # Calculate Carbon Credits
            carbon_credits = (co2_absorbed_kg / 1000) * final_score
            
            # Additional metrics
            quality_rating = self._determine_quality_rating(final_score)
            confidence_level = self._calculate_confidence_level(ai_tree_score, ndvi_score, iot_score)
            risk_factors = self._assess_risk_factors(data)
            
            # Detailed breakdown
            score_breakdown = {
                'AI_Tree_Score': {
                    'value': round(ai_tree_score, 3),
                    'weight': self.weights['ai_tree_score'],
                    'contribution': round(ai_tree_score * self.weights['ai_tree_score'], 3)
                },
                'NDVI_Score': {
                    'value': round(ndvi_score, 3),
                    'weight': self.weights['ndvi_score'],
                    'contribution': round(ndvi_score * self.weights['ndvi_score'], 3)
                },
                'IoT_Score': {
                    'value': round(iot_score, 3),
                    'weight': self.weights['iot_score'],
                    'contribution': round(iot_score * self.weights['iot_score'], 3)
                },
                'Audit_Check': {
                    'value': round(audit_check, 3),
                    'weight': self.weights['audit_check'],
                    'contribution': round(audit_check * self.weights['audit_check'], 3)
                }
            }
            
            return {
                "Tree_Count": tree_count,
                "Claimed_Trees": claimed_trees,
                "AI_Tree_Score": round(ai_tree_score, 3),
                "NDVI_Score": round(ndvi_score, 3),
                "IoT_Score": round(iot_score, 3),
                "Audit_Check": round(audit_check, 3),
                "Final_Score": round(final_score, 3),
                "CO2_absorbed_kg": round(co2_absorbed_kg, 2),
                "Carbon_Credits": round(carbon_credits, 3),
                "Quality_Rating": quality_rating,
                "Confidence_Level": confidence_level,
                "Score_Breakdown": score_breakdown,
                "Risk_Factors": risk_factors,
                "Calculation_Timestamp": datetime.now().isoformat(),
                "status": "success"
            }
            
        except Exception as e:
            logger.error(f"Final score calculation failed: {e}")
            return {
                "error": f"Final score calculation failed: {str(e)}",
                "Final_Score": 0.0,
                "Carbon_Credits": 0.0
            }
    
    def _validate_inputs(self, tree_count, claimed_trees, ndvi_score, iot_score, audit_check):
        """Validate input parameters"""
        if tree_count < 0:
            raise ValueError("Tree count cannot be negative")
        
        if claimed_trees <= 0:
            raise ValueError("Claimed trees must be positive")
        
        if not 0 <= ndvi_score <= 1:
            raise ValueError("NDVI score must be between 0 and 1")
        
        if not 0 <= iot_score <= 1:
            raise ValueError("IoT score must be between 0 and 1")
        
        if not 0 <= audit_check <= 1:
            raise ValueError("Audit check must be between 0 and 1")
    
    def _calculate_ai_tree_score(self, tree_count, claimed_trees):
        """
        Calculate AI Tree Score = Trees_detected / Trees_claimed
        Apply smoothing to handle edge cases
        """
        if claimed_trees == 0:
            return 0.0
        
        raw_score = tree_count / claimed_trees
        
        # Apply smoothing for more realistic scoring
        # Penalize significant over-detection (possible false positives)
        if raw_score > 1.2:
            # Gradually reduce score for over-detection
            penalty = (raw_score - 1.2) * 0.3
            raw_score = 1.2 - penalty
        
        # Cap the score at 1.0 for perfect or slight over-detection
        ai_tree_score = min(1.0, max(0.0, raw_score))
        
        return ai_tree_score
    
    def _determine_quality_rating(self, final_score):
        """Determine credit quality rating based on final score"""
        if final_score >= self.quality_thresholds['premium']:
            return "Premium"
        elif final_score >= self.quality_thresholds['standard']:
            return "Standard"
        elif final_score >= self.quality_thresholds['basic']:
            return "Basic"
        else:
            return "Insufficient"
    
    def _calculate_confidence_level(self, ai_score, ndvi_score, iot_score):
        """Calculate overall confidence level in the verification"""
        scores = [ai_score, ndvi_score, iot_score]
        
        # Calculate variance in scores
        score_variance = np.var(scores)
        mean_score = np.mean(scores)
        
        # High confidence if scores are consistent and high
        if score_variance < 0.05 and mean_score > 0.8:
            return "High"
        elif score_variance < 0.1 and mean_score > 0.6:
            return "Medium"
        else:
            return "Low"
    
    def _assess_risk_factors(self, data):
        """Assess potential risk factors in the verification"""
        risk_factors = []
        
        tree_count = data.get('tree_count', 0)
        claimed_trees = data.get('claimed_trees', 1)
        ndvi_score = data.get('ndvi_score', 0)
        iot_score = data.get('iot_score', 0)
        
        # Tree count discrepancy
        detection_ratio = tree_count / claimed_trees if claimed_trees > 0 else 0
        if detection_ratio < 0.7:
            risk_factors.append({
                "type": "Low Tree Detection",
                "severity": "High",
                "description": f"Only {detection_ratio:.1%} of claimed trees detected"
            })
        elif detection_ratio > 1.3:
            risk_factors.append({
                "type": "Over Detection",
                "severity": "Medium",
                "description": f"Detection exceeds claims by {(detection_ratio-1):.1%}"
            })
        
        # Low vegetation health
        if ndvi_score < 0.4:
            risk_factors.append({
                "type": "Poor Vegetation Health",
                "severity": "High",
                "description": f"NDVI score of {ndvi_score:.2f} indicates unhealthy vegetation"
            })
        
        # Poor environmental conditions
        if iot_score < 0.5:
            risk_factors.append({
                "type": "Suboptimal Environment",
                "severity": "Medium",
                "description": f"IoT score of {iot_score:.2f} indicates challenging conditions"
            })
        
        # Data consistency check
        if abs(ndvi_score - iot_score) > 0.4:
            risk_factors.append({
                "type": "Data Inconsistency",
                "severity": "Medium",
                "description": "Large discrepancy between NDVI and IoT environmental scores"
            })
        
        return risk_factors
    
    def calculate_batch_scores(self, batch_data):
        """
        Calculate scores for multiple projects in batch
        
        Args:
            batch_data: List of project data dictionaries
            
        Returns:
            dict: Batch calculation results
        """
        try:
            results = []
            summary_stats = {
                'total_projects': len(batch_data),
                'successful_calculations': 0,
                'failed_calculations': 0,
                'total_trees': 0,
                'total_co2_kg': 0,
                'total_credits': 0,
                'average_final_score': 0
            }
            
            for i, project_data in enumerate(batch_data):
                project_id = project_data.get('project_id', f'project_{i+1}')
                
                try:
                    result = self.calculate_final_score(project_data)
                    result['project_id'] = project_id
                    results.append(result)
                    
                    if result.get('status') == 'success':
                        summary_stats['successful_calculations'] += 1
                        summary_stats['total_trees'] += result['Tree_Count']
                        summary_stats['total_co2_kg'] += result['CO2_absorbed_kg']
                        summary_stats['total_credits'] += result['Carbon_Credits']
                        summary_stats['average_final_score'] += result['Final_Score']
                    else:
                        summary_stats['failed_calculations'] += 1
                        
                except Exception as e:
                    summary_stats['failed_calculations'] += 1
                    results.append({
                        'project_id': project_id,
                        'error': str(e),
                        'status': 'failed'
                    })
            
            # Calculate averages
            if summary_stats['successful_calculations'] > 0:
                summary_stats['average_final_score'] /= summary_stats['successful_calculations']
                summary_stats['average_final_score'] = round(summary_stats['average_final_score'], 3)
            
            return {
                'results': results,
                'summary_statistics': summary_stats,
                'status': 'success'
            }
            
        except Exception as e:
            logger.error(f"Batch calculation failed: {e}")
            return {
                'error': f"Batch calculation failed: {str(e)}",
                'results': [],
                'summary_statistics': {}
            }
    
    def generate_verification_report(self, calculation_result):
        """
        Generate a comprehensive verification report
        
        Args:
            calculation_result: Result from calculate_final_score
            
        Returns:
            dict: Formatted verification report
        """
        try:
            if calculation_result.get('status') != 'success':
                return calculation_result
            
            report = {
                "report_header": {
                    "report_type": "Mangrove Plantation Verification Report",
                    "generated_at": datetime.now().isoformat(),
                    "verification_standard": "EcoLedger AI Verification v1.0"
                },
                
                "project_summary": {
                    "trees_detected": calculation_result['Tree_Count'],
                    "trees_claimed": calculation_result['Claimed_Trees'],
                    "detection_accuracy": f"{(calculation_result['AI_Tree_Score'] * 100):.1f}%",
                    "final_verification_score": f"{(calculation_result['Final_Score'] * 100):.1f}%",
                    "quality_rating": calculation_result['Quality_Rating']
                },
                
                "environmental_assessment": {
                    "vegetation_health_score": f"{(calculation_result['NDVI_Score'] * 100):.1f}%",
                    "environmental_conditions_score": f"{(calculation_result['IoT_Score'] * 100):.1f}%",
                    "audit_verification_score": f"{(calculation_result['Audit_Check'] * 100):.1f}%"
                },
                
                "carbon_impact": {
                    "co2_absorbed_kg_annual": calculation_result['CO2_absorbed_kg'],
                    "co2_absorbed_tonnes_annual": round(calculation_result['CO2_absorbed_kg'] / 1000, 3),
                    "carbon_credits_issued": calculation_result['Carbon_Credits'],
                    "carbon_credits_quality": calculation_result['Quality_Rating']
                },
                
                "methodology": {
                    "ai_tree_detection_weight": "40%",
                    "vegetation_health_weight": "30%",
                    "environmental_conditions_weight": "20%",
                    "audit_verification_weight": "10%",
                    "co2_calculation_rate": f"{self.co2_per_tree} kg CO₂ per tree per year"
                },
                
                "risk_assessment": {
                    "confidence_level": calculation_result['Confidence_Level'],
                    "identified_risks": calculation_result['Risk_Factors']
                },
                
                "recommendations": self._generate_recommendations(calculation_result),
                
                "certification_status": self._determine_certification_status(calculation_result['Final_Score']),
                
                "detailed_scores": calculation_result['Score_Breakdown']
            }
            
            return report
            
        except Exception as e:
            logger.error(f"Report generation failed: {e}")
            return {
                "error": f"Report generation failed: {str(e)}",
                "report_header": {"generated_at": datetime.now().isoformat()}
            }
    
    def _generate_recommendations(self, result):
        """Generate recommendations based on verification results"""
        recommendations = []
        
        final_score = result['Final_Score']
        ai_score = result['AI_Tree_Score']
        ndvi_score = result['NDVI_Score']
        iot_score = result['IoT_Score']
        
        if final_score >= 0.9:
            recommendations.append("Excellent verification results. Project approved for premium carbon credits.")
        elif final_score >= 0.75:
            recommendations.append("Good verification results. Project approved for standard carbon credits.")
        elif final_score >= 0.6:
            recommendations.append("Moderate verification results. Project approved for basic carbon credits.")
        else:
            recommendations.append("Verification score insufficient for carbon credit issuance.")
        
        if ai_score < 0.7:
            recommendations.append("Consider improving tree detection accuracy through additional imagery or ground truthing.")
        
        if ndvi_score < 0.6:
            recommendations.append("Vegetation health indicators suggest need for improved plantation management.")
        
        if iot_score < 0.6:
            recommendations.append("Environmental conditions may require intervention to optimize tree growth.")
        
        return recommendations
    
    def _determine_certification_status(self, final_score):
        """Determine certification status based on final score"""
        if final_score >= 0.6:
            return {
                "status": "CERTIFIED",
                "certification_level": self._determine_quality_rating(final_score),
                "valid_for_carbon_credits": True
            }
        else:
            return {
                "status": "NOT CERTIFIED",
                "certification_level": "Insufficient",
                "valid_for_carbon_credits": False,
                "required_improvements": "Improve verification scores above 60% threshold"
            }