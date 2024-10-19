namespace API.Interfaces;

public interface IBaseRepository<TEntity> where TEntity : class
{
    Task<TEntity> GetByIdAsync(int id);
    Task<bool> SaveAllAsync();
    void Add(TEntity entity);
    void Update(TEntity entity);
    void Remove(TEntity entity);
}