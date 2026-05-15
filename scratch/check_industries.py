import asyncio
from src.infrastructure.db.session import get_session
from src.infrastructure.db.models.company import CompanyModel
from sqlalchemy import select

async def check():
    async for session in get_session():
        stmt = select(CompanyModel.industry).distinct()
        result = await session.execute(stmt)
        industries = result.scalars().all()
        print(f"Industries in DB: {industries}")
        
        stmt_count = select(CompanyModel.name, CompanyModel.industry).limit(5)
        result_count = await session.execute(stmt_count)
        samples = result_count.all()
        print(f"Sample companies: {samples}")
        break

if __name__ == "__main__":
    asyncio.run(check())
