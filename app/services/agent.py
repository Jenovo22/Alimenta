"""Agent service - Gestor Logístico for donation management."""

from typing import List, Dict, Any, Optional
from datetime import datetime
from sqlmodel import Session, select


class LogisticsManager:
    """
    Gestor Logístico - Pondera donaciones y decide distribución de recursos.
    
    Criterios de ponderación (basados en paper IJIRT210234):
    1. Equidad comunitaria (30%) - comunidades con mayor necesidad
    2. Urgencia (25%) - necesidades insatisfechas críticas  
    3. Eficiencia logística (25%) - optimización de transporte
    4. Impacto social (20%) - beneficio para población vulnerable
    """
    
    # Default weights
    DEFAULT_WEIGHTS = {
        "equity": 0.30,      # Comunidad vulnerability & equity
        "urgency": 0.25,     # Unmet needs urgency
        "efficiency": 0.25,  # Logistics optimization
        "impact": 0.20       # Social impact potential
    }
    
    def __init__(self, session: Session, weights: Optional[Dict[str, float]] = None):
        self.session = session
        self.weights = weights or self.DEFAULT_WEIGHTS
    
    def analyze_donation(self, donation_id: int) -> Dict[str, Any]:
        """Analyze a single donation with scoring."""
        from ..models.donation import Donation
        from ..models.community import Community
        from ..models.need import Need
        from ..models.inventory import Inventory
        
        donation = self.session.get(Donation, donation_id)
        if not donation:
            raise ValueError(f"Donation {donation_id} not found")
        
        # Get community data
        query = select(Community).where(Community.id == donation.donor_community_id)
        communities = self.session.exec(query).all()
        community_score = self._score_community_equity(communities)
        
        # Get need data
        if donation.need_id:
            need = self.session.get(Need, donation.need_id)
            need_score = self._score_need_urgency(need) if need else 0
        else:
            need_score = 0.5
        
        # Calculate logistics efficiency
        logistics_score = self._score_logistics_efficiency(donation)
        
        # Calculate social impact
        impact_score = self._score_social_impact(donation, communities)
        
        # Weighted total score
        total_score = (
            community_score * self.weights["equity"] +
            need_score * self.weights["urgency"] +
            logistics_score * self.weights["efficiency"] +
            impact_score * self.weights["impact"]
        )
        
        # Decision recommendation
        recommendation = self._recommend_decision(total_score, donation)
        
        return {
            "donation_id": donation_id,
            "score": round(total_score, 4),
            "scores": {
                "community_equity": round(community_score, 4),
                "need_urgency": round(need_score, 4),
                "logistics_efficiency": round(logistics_score, 4),
                "social_impact": round(impact_score, 4)
            },
            "recommendation": recommendation,
            "weights": self.weights,
            "analyzed_at": datetime.utcnow().isoformat()
        }
    
    def analyze_all_pending(self, limit: int = 100) -> List[Dict[str, Any]]:
        """Analyze all pending donations and rank them."""
        from ..models.donation import Donation
        
        query = select(Donation).where(
            Donation.status == "Ofrecida",
            Donation.appointment_status == "Pendiente de aceptación"
        ).order_by(Donation.created_at.desc()).limit(limit)
        
        donations = self.session.exec(query).all()
        results = []
        
        for donation in donations:
            try:
                analysis = self.analyze_donation(donation.id)
                results.append(analysis)
            except Exception as e:
                results.append({
                    "donation_id": donation.id,
                    "error": str(e),
                    "recommendation": "skip"
                })
        
        # Sort by score descending
        results.sort(key=lambda x: x.get("score", 0), reverse=True)
        return results
    
    def allocate_inventory(
        self, 
        product_id: int, 
        quantity: int,
        exclude_community_ids: Optional[List[int]] = None
    ) -> List[Dict[str, Any]]:
        """
        Decide how to allocate inventory to communities.
        Returns list of allocations sorted by priority.
        """
        from ..models.community import Community
        from ..models.need import Need
        from ..models.inventory import Inventory
        
        exclude = set(exclude_community_ids or [])
        
        # Get all needs for this product not satisfied
        query = (
            select(Need, Community)
            .join(Community, Need.community_id == Community.id)
            .where(
                Need.product_id == product_id,
                Need.is_satisfied == False,
                ~Community.id.in_(exclude)
            )
            .order_by(Community.vulnerability_score.desc(), Need.quantity.desc())
        )
        
        results = self.session.exec(query).all()
        
        allocations = []
        remaining_quantity = quantity
        
        for need, community in results:
            if remaining_quantity <= 0:
                break
            
            alloc_qty = min(need.quantity, remaining_quantity)
            allocations.append({
                "community_id": community.id,
                "community_name": community.name,
                "vulnerability_score": getattr(community, 'vulnerability_score', 0.5),
                "need_id": need.id,
                "requested_quantity": need.quantity,
                "allocated_quantity": alloc_qty,
                "priority": len(allocations) + 1,
                "rationale": f"High vulnerability community ({community.name}) with unmet need"
            })
            remaining_quantity -= alloc_qty
        
        return allocations
    
    def _score_community_equity(self, communities: List[Any]) -> float:
        """Score based on community equity metrics."""
        if not communities:
            return 0.5
        
        # Higher vulnerability = higher priority for equitable distribution
        scores = [getattr(c, 'vulnerability_score', 0.5) for c in communities]
        return sum(scores) / len(scores)
    
    def _score_need_urgency(self, need: Any) -> float:
        """Score based on need urgency."""
        if not need:
            return 0.5
        
        # Freshness and quantity factors
        urgency = 0.5
        if hasattr(need, 'is_satisfied') and not need.is_satisfied:
            urgency += 0.2
        if hasattr(need, 'created_at') and need.created_at:
            days_old = (datetime.utcnow() - need.created_at).days
            if days_old > 7:
                urgency += 0.2
            elif days_old > 3:
                urgency += 0.1
        return min(urgency, 1.0)
    
    def _score_logistics_efficiency(self, donation: Any) -> float:
        """Score based on logistics efficiency."""
        score = 0.5
        
        # Prefer BANCO modality for better coordination
        if hasattr(donation, 'modality'):
            if donation.modality == "BANCO":
                score += 0.2
            elif donation.modality == "DIRIGIDA_EDIL":
                score += 0.1
        
        # Prefer larger quantities (more impactful per transport run)
        if hasattr(donation, 'quantity') and donation.quantity:
            if donation.quantity >= 10:
                score += 0.1
            elif donation.quantity >= 5:
                score += 0.05
        
        return min(score, 1.0)
    
    def _score_social_impact(self, donation: Any, communities: List[Any]) -> float:
        """Score based on potential social impact."""
        score = 0.5
        
        # More products per donation = more families helped
        if hasattr(donation, 'product_id') and donation.product_id:
            score += 0.1
        
        # Communities with higher vulnerability get more weight
        if communities:
            avg_vuln = sum(getattr(c, 'vulnerability_score', 0.5) for c in communities) / len(communities)
            score += avg_vuln * 0.2
        
        return min(score, 1.0)
    
    def _recommend_decision(self, score: float, donation: Any) -> str:
        """Recommend action based on score."""
        if score >= 0.7:
            return "approve"  # High priority, approve immediately
        elif score >= 0.5:
            return "review"   # Medium priority, standard review
        else:
            return "defer"    # Low priority, defer or reject


# Global instance factory
def create_agent_service(session: Session, weights: Optional[Dict[str, float]] = None) -> LogisticsManager:
    """Factory function to create an agent service instance."""
    return LogisticsManager(session=session, weights=weights)
