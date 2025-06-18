import app from './app';
import { config } from './config';
import { db } from './database';

async function startServer() {
	try {
		await db.initializeMockData();

		app.listen(config.port, () => {
			// Clear console and show banner
			console.clear();
			console.log('\n');
			console.log(
				'╔══════════════════════════════════════════════════════════════╗'
			);
			console.log(
				'║                        🚀 QuickPost API                      ║'
			);
			console.log(
				'║                    Ready for Testing & Learning             ║'
			);
			console.log(
				'╚══════════════════════════════════════════════════════════════╝'
			);
			console.log('\n');

			// Server info
			console.log('📍 SERVER INFO');
			console.log(`   🌐 API Server: http://localhost:${config.port}`);
			console.log(`   📖 Documentation: http://localhost:${config.port}`);
			console.log(
				`   ❤️  Health Check: http://localhost:${config.port}/health`
			);
			console.log(`   🗃️  Mock Data: ✅ Loaded (3 users, 3 posts)`);
			console.log('\n');

			// Quick test credentials
			console.log('🔐 TEST CREDENTIALS');
			console.log('   👤 Username: john_doe');
			console.log('   🔑 Password: password123');
			console.log('\n');

			// Quick start examples
			console.log('⚡ QUICK START');
			console.log('   # Login and get token');
			console.log(
				`   curl -X POST http://localhost:${config.port}/auth/login \\`
			);
			console.log('     -H "Content-Type: application/json" \\');
			console.log(
				'     -d \'{"username":"john_doe","password":"password123"}\''
			);
			console.log('\n');
			console.log('   # Get all posts (no auth required)');
			console.log(`   curl http://localhost:${config.port}/posts`);
			console.log('\n');
			console.log('   # Reset data anytime');
			console.log(`   curl -X POST http://localhost:${config.port}/reset`);
			console.log('\n');

			// Available endpoints summary
			console.log('🛣️  KEY ENDPOINTS');
			console.log('   📝 Posts: GET /posts, POST /posts 🔒, PUT /posts/:id 🔒');
			console.log('   👥 Users: GET /users 🔒, GET /users/:id 🔒');
			console.log('   🔐 Auth: POST /auth/login, POST /auth/register');
			console.log('   🔧 Utils: GET /health, POST /reset');
			console.log('\n');

			console.log('💡 TIP: Use Postman, Insomnia, or any HTTP client to test');
			console.log('🔒 = Requires Authentication');
			console.log('\n');
			console.log('Happy testing! 🎉');
			console.log('─'.repeat(66));
		});
	} catch (error) {
		console.error('\n❌ Failed to start server:', error);
		process.exit(1);
	}
}

// Handle graceful shutdown
process.on('SIGINT', () => {
	console.log('\n');
	console.log('🛑 Shutting down QuickPost API...');
	console.log('👋 Thanks for using QuickPost API!');
	process.exit(0);
});

process.on('SIGTERM', () => {
	console.log('\n');
	console.log('🛑 Shutting down QuickPost API...');
	console.log('👋 Thanks for using QuickPost API!');
	process.exit(0);
});

startServer();
