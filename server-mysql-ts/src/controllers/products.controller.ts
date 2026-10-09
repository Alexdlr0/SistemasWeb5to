import { Request, Response } from 'express';
import { pool } from '../conf/dbConnection';

export class ProductsController {
    
    // GET /getAll
    static async getAll(req: Request, res: Response) {
        try {
            const [rows] = await pool.query('SELECT * FROM products WHERE active = TRUE');
            res.json(rows);
        } catch (error) {
            res.status(500).json({ error: 'Error al consultar productos' });
        }
    }

    // GET /getById/:id
    static async getById(req: Request, res: Response): Promise<any> {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ error: 'El ID debe ser un entero positivo' });
        }

        try {
            const [rows]: any = await pool.query('SELECT * FROM products WHERE id = ? AND active = TRUE', [id]);
            if (rows.length === 0) {
                return res.status(404).json({ error: 'Producto no encontrado o inactivo' });
            }
            res.json(rows[0]);
        } catch (error) {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    // POST /create
    static async create(req: Request, res: Response): Promise<any> {
        const { name, price, stock, description, brand, img } = req.body;

        if (!name || typeof price !== 'number' || price <= 0 || stock === undefined || !description) {
            return res.status(400).json({ error: 'Datos inválidos. Verifica que el precio sea mayor a 0 y envíes los campos obligatorios.' });
        }

        try {
            const [result]: any = await pool.query(
                'INSERT INTO products (name, price, stock, description, brand, img) VALUES (?, ?, ?, ?, ?, ?)',
                [name, price, stock, description, brand || null, img || null]
            );
            res.status(201).json({ message: 'Producto creado', insertId: result.insertId });
        } catch (error) {
            res.status(500).json({ error: 'Error al crear el producto' });
        }
    }

    // PUT /update/:id
    static async update(req: Request, res: Response): Promise<any> {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'ID inválido' });

        const { name, price, stock, description, brand, img } = req.body;
        if (!name || typeof price !== 'number' || price <= 0 || stock === undefined || !description) {
            return res.status(400).json({ error: 'Datos inválidos. El precio debe ser mayor a 0.' });
        }

        try {
            const [result]: any = await pool.query(
                'UPDATE products SET name = ?, price = ?, stock = ?, description = ?, brand = ?, img = ? WHERE id = ? AND active = TRUE',
                [name, price, stock, description, brand || null, img || null, id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Producto no encontrado o inactivo' });
            }
            res.json({ message: 'Producto actualizado exitosamente' });
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar el producto' });
        }
    }

    // DELETE /delete/:id (Baja Lógica)
    static async delete(req: Request, res: Response): Promise<any> {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'ID inválido' });

        try {
            const [result]: any = await pool.query(
                'UPDATE products SET active = FALSE WHERE id = ? AND active = TRUE',
                [id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Producto no encontrado o ya estaba inactivo' });
            }
            res.json({ message: 'Producto dado de baja exitosamente' });
        } catch (error) {
            res.status(500).json({ error: 'Error al eliminar el producto' });
        }
    }

    // PATCH /change-price/:id
    static async changePrice(req: Request, res: Response): Promise<any> {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'ID inválido' });

        const { price } = req.body;
        if (typeof price !== 'number' || price <= 0) {
            return res.status(400).json({ error: 'El precio debe ser un número mayor a 0' });
        }

        try {
            const [result]: any = await pool.query(
                'UPDATE products SET price = ? WHERE id = ? AND active = TRUE',
                [price, id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Producto no encontrado o inactivo' });
            }
            res.json({ message: 'Precio actualizado exitosamente' });
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar el precio' });
        }
    }
}