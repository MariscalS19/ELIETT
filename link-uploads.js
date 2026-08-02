// link-uploads.js
const fs = require('fs');
const path = require('path');

function setupUploadsSymlink() {
    const targetPath = process.env.SHARED_UPLOADS_PATH;
    // Usefull for debugging, but not necessary to log in production
    if (!targetPath) {
        console.log(
            'SHARED_UPLOADS_PATH is not defined. Omitting symbolic link creation.'
        );
        return;
    }

    const linkPath = path.join(process.cwd(), 'public', 'uploads');

    try {
        // 1.Delete any existing file, folder, or symlink at public/uploads
        if (
            fs.existsSync(linkPath) ||
            fs.lstatSync(linkPath).isSymbolicLink()
        ) {
            fs.rmSync(linkPath, { recursive: true, force: true });
        }

        // 2.Create the symbolic link to the path defined in the environment variable
        fs.symlinkSync(targetPath, linkPath, 'dir');
        console.log(
            `✅ Symlink created successfully: public/uploads -> ${targetPath}`
        );
    } catch (error) {
        console.error('❌ Error creating symbolic link:', error.message);
    }
}

setupUploadsSymlink();
