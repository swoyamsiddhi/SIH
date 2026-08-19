from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime

class AthleteDNA(SQLModel, table=True):
    __tablename__ = "athlete_dna"
    id: Optional[int] = Field(default=None, primary_key=True)
    athlete_id: int = Field(index=True)
    
    # 0 to 100 scores. None if insufficient data.
    speed: Optional[float] = None
    speed_confidence: Optional[float] = None
    
    power: Optional[float] = None
    power_confidence: Optional[float] = None
    
    agility: Optional[float] = None
    agility_confidence: Optional[float] = None
    
    endurance: Optional[float] = None
    endurance_confidence: Optional[float] = None
    
    reaction: Optional[float] = None
    reaction_confidence: Optional[float] = None
    
    flexibility: Optional[float] = None
    flexibility_confidence: Optional[float] = None
    
    balance: Optional[float] = None
    balance_confidence: Optional[float] = None
    
    movement_quality: Optional[float] = None
    movement_quality_confidence: Optional[float] = None
    
    data_completeness: float = Field(default=0.0) # 0.0 to 1.0
    benchmark_version: str = Field(default="v1.0")
    calculation_version: str = Field(default="v1.0")
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class NormativeReference(SQLModel, table=True):
    __tablename__ = "normative_references"
    id: Optional[int] = Field(default=None, primary_key=True)
    metric: str
    age_group_min: int
    age_group_max: int
    sex: str # "M", "F", "Any"
    mean_value: float
    std_dev: float
    source: str
    sample_size: int
    population_description: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class DNADimensionSource(SQLModel, table=True):
    __tablename__ = "dna_dimension_sources"
    id: Optional[int] = Field(default=None, primary_key=True)
    athlete_dna_id: int = Field(foreign_key="athlete_dna.id")
    
    dimension: str # e.g. "power"
    metric: str # e.g. "jump_height_cm"
    raw_value: float
    unit: str
    normalized_value: float
    benchmark_group: str # e.g. "U18_Male_Demo"
    source_assessment_id: int
    calculation_method: str
    
    created_at: datetime = Field(default_factory=datetime.utcnow)

class SportProfile(SQLModel, table=True):
    __tablename__ = "sport_profiles"
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(unique=True, index=True)
    description: str
    version: str = Field(default="v1.0")

class SportRequirement(SQLModel, table=True):
    __tablename__ = "sport_requirements"
    id: Optional[int] = Field(default=None, primary_key=True)
    sport_profile_id: int = Field(foreign_key="sport_profiles.id")
    dimension: str # e.g. "speed"
    weight: float # 0.0 to 1.0
    preferred_range_min: float
    preferred_range_max: float
    evidence_source: str = Field(default="Research hypothesis")
    version: str = Field(default="v1.0")

class SportPotential(SQLModel, table=True):
    __tablename__ = "sport_potentials"
    id: Optional[int] = Field(default=None, primary_key=True)
    athlete_id: int = Field(index=True)
    sport_profile_id: int = Field(foreign_key="sport_profiles.id")
    
    suitability_score: float # 0.0 to 100.0
    confidence_score: float # 0.0 to 100.0
    
    strengths_json: str = Field(default="[]")
    development_gaps_json: str = Field(default="[]")
    explanation_json: str = Field(default="{}")
    
    calculation_version: str = Field(default="v1.0")
    created_at: datetime = Field(default_factory=datetime.utcnow)
