from sqlmodel import Session, select
from app.core.database import engine
from app.modules.athletes.models import Athlete
from app.modules.growth.models import GrowthRecord, PersonalBest
import json

def dump():
    with Session(engine) as session:
        athletes = session.exec(select(Athlete)).all()
        for a in athletes:
            print(f"=== Athlete: {a.name} (Trend Configured: {a.location}) ===") # location was just a field, actually trend isn't stored on athlete, but name is Neeraj, Rahul etc
            
            grs = session.exec(select(GrowthRecord).where(GrowthRecord.athlete_id == a.id).order_by(GrowthRecord.recorded_at)).all()
            print(f"  Growth Records ({len(grs)}):")
            for gr in grs:
                print(f"    - {gr.metric}: {gr.raw_value} (Prev: {gr.previous_value}) | Trend: {gr.trend} | Abs: {gr.improvement_absolute} | Pct: {gr.improvement_percentage}% | Points: {gr.data_points_count}")
                
            pbs = session.exec(select(PersonalBest).where(PersonalBest.athlete_id == a.id)).all()
            print(f"  Personal Bests ({len(pbs)}):")
            for pb in pbs:
                print(f"    - {pb.metric}: {pb.value}")
            print("\n")

if __name__ == "__main__":
    dump()
