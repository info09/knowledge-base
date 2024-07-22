using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;

namespace KnowledgeSpace.BackendServer.Services
{
    public class SequenceService : ISequenceService
    {
        private readonly IConfiguration _configuration;

        public SequenceService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<int> GetKnowledgeBaseNewId()
        {
            using (SqlConnection conn = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
            {
                if (conn.State == System.Data.ConnectionState.Closed)
                    await conn.OpenAsync();


                var result = await conn.ExecuteScalarAsync<int>(@"SELECT (NEXT VALUE FOR KnowledgeBaseSequence)", null, null, 120, System.Data.CommandType.Text);
                return result;
            }
        }
    }
}
